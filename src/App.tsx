import { useState, useEffect } from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BankView } from './components/BankView';
import { CryptoWalletView } from './components/CryptoWalletView';
import { HardwareStoreView } from './components/HardwareStoreView';
import { RigBuilderView } from './components/RigBuilderView';
import { MyRigsView } from './components/MyRigsView';
import { CryptoExchangeView } from './components/CryptoExchangeView';
import { PoolsView } from './components/PoolsView';
import { BusinessesView } from './components/BusinessesView';
import { MultiplayerView } from './components/MultiplayerView';
import { HackerPcView } from './components/HackerPcView';
import { AdminPanelView } from './components/AdminPanelView';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';

import {
  UserAccount,
  MiningRig,
  MiningPool,
  TransactionRecord,
  MarketPrice,
  CoinSymbol,
  HardwareItem,
  UserBusiness,
} from './types';
import {
  getCurrentUser,
  getAllUsers,
  saveUser,
  setCurrentUserId,
  getAllRigs,
  saveRigs,
  saveSingleRig,
  deleteRig,
  getAllPools,
  savePool,
  getAllTransactions,
  getUserTransactions,
  logTransaction,
  getMarketPrices,
  updateMarketPrices,
  processGameTick,
  resetAllData,
  fullSystemReset,
  cleanupExpiredBannedUsers,
  renameMiningRig,
  updateCardPin,
  topUpFromOtherCard,
  purchaseHackerPc,
  startBruteForceJob,
  updateHackerPcJobs,
} from './services/storageService';
import { BUSINESS_TEMPLATES, calculateUpgradeCost, calculateStaffCost, calculateMarketingCost } from './data/businessData';
import { getHardwareById } from './data/hardwareData';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getCurrentUser);
  const [allUsers, setAllUsers] = useState<UserAccount[]>(getAllUsers);
  const [activeTab, setActiveTab] = useState<string>('bank');
  const [prefilledTopUpCard, setPrefilledTopUpCard] = useState('');
  const [prefilledTopUpPin, setPrefilledTopUpPin] = useState('');
  const [rigs, setRigs] = useState<MiningRig[]>(getAllRigs);
  const [pools, setPools] = useState<MiningPool[]>(getAllPools);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(getAllTransactions);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(getMarketPrices);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync state helpers
  const refreshUserData = () => {
    cleanupExpiredBannedUsers();
    const all = getAllUsers();
    setAllUsers(all);
    const freshUser = getCurrentUser();
    setCurrentUser(freshUser);
    setRigs(getAllRigs());
    setPools(getAllPools());
    setTransactions(freshUser ? getUserTransactions(freshUser.id) : []);
    setMarketPrices(getMarketPrices());
  };

  // Main Simulation Interval (Every 1s for game payouts and 15s for market ticker)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      // 1. Process mining rewards & business revenues
      cleanupExpiredBannedUsers();
      const result = processGameTick();
      updateHackerPcJobs(currentUser.id);
      
      const all = getAllUsers();
      setAllUsers(all);

      // Check if currentUser still exists in DB
      const existingUserInDb = all.find((u) => u.id === currentUser.id);
      if (!existingUserInDb) {
        setCurrentUser(null);
        return;
      } else {
        setCurrentUser(existingUserInDb);
      }

      setRigs(getAllRigs());
      setPools(getAllPools());

      // Log mining payouts if any occurred in this tick for currentUser
      result.miningPayouts.forEach((p) => {
        if (!p.userId || p.userId === currentUser.id) {
          logTransaction({
            userId: currentUser.id,
            type: 'mining_payout',
            amount: Number(p.amount.toFixed(6)),
            currency: p.coin,
            description: `Награда с майнинга «${p.rigName}» зачислена на адрес ${p.targetAddress.slice(0, 10)}...`,
          });
        }
      });

      const userTxs = getUserTransactions(currentUser.id);
      setTransactions(userTxs);
    }, 1000);

    // Market Price Fluctuation (every 15 seconds)
    const marketInterval = setInterval(() => {
      const updated = updateMarketPrices();
      setMarketPrices(updated);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(marketInterval);
    };
  }, [currentUser?.id]);

  // Total hashrate of all running rigs in the game
  const totalNetworkHashrate = rigs
    .filter((r) => r.status === 'mining')
    .reduce((acc, r) => acc + r.totalHashrate * (1 + r.overclockPercent / 100), 0);

  // If no user is logged in / registered yet, show clean Auth Screen (Login / Register)
  if (!currentUser) {
    return (
      <AuthScreen
        onAuthenticated={(newUser) => {
          setCurrentUser(newUser);
          refreshUserData();
        }}
      />
    );
  }

  // 1. Handlers for Bank & USD Transfers
  const handleSendUSD = (recipientCardOrName: string, amount: number, note: string): boolean => {
    const peak = Math.max(currentUser.maxBalanceReachedUSD || 0, currentUser.bankBalanceUSD);
    if (peak < 15000) {
      return false; // transfer blocked until $15,000 peak reached
    }

    if (amount > currentUser.bankBalanceUSD || amount <= 0) return false;

    const normalizedTarget = recipientCardOrName.replace(/\s+/g, '').toLowerCase();

    // Check if recipient is a registered player
    const users = getAllUsers();
    let targetRegisteredUser = users.find((u) => {
      const userCardNorm = u.bankCard.cardNumber.replace(/\s+/g, '').toLowerCase();
      const userNameNorm = u.username.toLowerCase();
      return userCardNorm === normalizedTarget || userNameNorm === normalizedTarget;
    });

    if (!targetRegisteredUser) {
      // Also allow transfer to valid 16-digit simulation card numbers
      if (normalizedTarget.length < 10) return false;
    }

    // Deduct from current user
    currentUser.bankBalanceUSD -= amount;
    saveUser(currentUser);

    // Credit target if registered
    if (targetRegisteredUser && targetRegisteredUser.id !== currentUser.id) {
      targetRegisteredUser.bankBalanceUSD += amount;
      saveUser(targetRegisteredUser);

      // Log incoming transaction for recipient's personal ledger
      logTransaction({
        userId: targetRegisteredUser.id,
        type: 'bank_transfer',
        amount: amount,
        currency: 'USD',
        description: `Входящий перевод от ${currentUser.username} (${note || 'P2P перевод'})`,
      });
    }

    // Log outgoing transaction for sender's personal ledger
    logTransaction({
      userId: currentUser.id,
      type: 'bank_transfer',
      amount: -amount,
      currency: 'USD',
      description: `Перевод на карту/игроку ${recipientCardOrName} (${note || 'P2P перевод'})`,
    });

    refreshUserData();
    return true;
  };

  const handleConvertUsdUsdt = (amount: number, direction: 'usd_to_usdt' | 'usdt_to_usd'): boolean => {
    if (amount <= 0) return false;

    if (direction === 'usd_to_usdt') {
      if (currentUser.bankBalanceUSD < amount) return false;
      currentUser.bankBalanceUSD -= amount;
      currentUser.cryptoBalances.USDT = (currentUser.cryptoBalances.USDT || 0) + amount;
    } else {
      if ((currentUser.cryptoBalances.USDT || 0) < amount) return false;
      currentUser.cryptoBalances.USDT -= amount;
      currentUser.bankBalanceUSD += amount;
    }

    saveUser(currentUser);
    logTransaction({
      type: 'currency_exchange',
      amount: direction === 'usd_to_usdt' ? -amount : amount,
      currency: 'USD',
      description: direction === 'usd_to_usdt' ? 'Обмен USD на USDT (1:1)' : 'Вывод USDT в доллары USD на карту (1:1)',
    });

    refreshUserData();
    return true;
  };

  // 2. Handlers for Crypto Transfers
  const handleSendCrypto = (coin: CoinSymbol, targetAddress: string, amount: number): boolean => {
    const currentBal = currentUser.cryptoBalances[coin] || 0;
    if (amount <= 0 || amount > currentBal) return false;

    currentUser.cryptoBalances[coin] -= amount;
    saveUser(currentUser);

    // Credit recipient if matching a registered user
    const users = getAllUsers();
    const targetUser = users.find((u) => u.cryptoAddresses[coin] === targetAddress);
    if (targetUser && targetUser.id !== currentUser.id) {
      targetUser.cryptoBalances[coin] = (targetUser.cryptoBalances[coin] || 0) + amount;
      saveUser(targetUser);
    }

    logTransaction({
      type: 'crypto_transfer',
      amount: -amount,
      currency: coin,
      description: `Отправка ${amount} ${coin} на адрес ${targetAddress.slice(0, 12)}...`,
    });

    refreshUserData();
    return true;
  };

  // 3. Hardware Store Purchase
  const handleBuyHardware = (item: HardwareItem, currency: 'USD' | 'USDT'): boolean => {
    const price = item.priceUSD;

    if (currency === 'USD') {
      if (currentUser.bankBalanceUSD < price) return false;
      currentUser.bankBalanceUSD -= price;
    } else {
      if ((currentUser.cryptoBalances.USDT || 0) < price) return false;
      currentUser.cryptoBalances.USDT -= price;
    }

    // Add item to inventory
    const key = item.category === 'rack' ? 'racks' :
                item.category === 'motherboard' ? 'motherboards' :
                item.category === 'cpu' ? 'cpus' :
                item.category === 'gpu' ? 'gpus' : 'psus';

    currentUser.inventory[key].push(item.id);
    saveUser(currentUser);

    logTransaction({
      type: 'hardware_purchase',
      amount: -price,
      currency: currency,
      description: `Покупка оборудования: ${item.name} (${item.category.toUpperCase()})`,
    });

    refreshUserData();
    return true;
  };

  // 4. Deploy Rig from Builder
  const handleDeployRig = (config: {
    name: string;
    rackId: string;
    motherboardId: string;
    cpuId: string;
    psuIds: string[];
    gpuIds: string[];
    targetCoin: CoinSymbol;
    targetWalletAddress: string;
    poolId: string;
  }): boolean => {
    if (!currentUser) return false;

    // Verify currentUser actually owns all requested components in inventory
    const tempRacks = [...currentUser.inventory.racks];
    const tempMbs = [...currentUser.inventory.motherboards];
    const tempCpus = [...currentUser.inventory.cpus];
    const tempPsus = [...currentUser.inventory.psus];
    const tempGpus = [...currentUser.inventory.gpus];

    // Rack
    const rackIdx = tempRacks.indexOf(config.rackId);
    if (rackIdx < 0) return false;
    tempRacks.splice(rackIdx, 1);

    // Motherboard
    const mbIdx = tempMbs.indexOf(config.motherboardId);
    if (mbIdx < 0) return false;
    tempMbs.splice(mbIdx, 1);

    // CPU
    const cpuIdx = tempCpus.indexOf(config.cpuId);
    if (cpuIdx < 0) return false;
    tempCpus.splice(cpuIdx, 1);

    // PSUs
    for (const psuId of config.psuIds) {
      const pIdx = tempPsus.indexOf(psuId);
      if (pIdx < 0) return false;
      tempPsus.splice(pIdx, 1);
    }

    // GPUs
    for (const gpuId of config.gpuIds) {
      const gIdx = tempGpus.indexOf(gpuId);
      if (gIdx < 0) return false;
      tempGpus.splice(gIdx, 1);
    }

    // Ownership verified! Update actual user inventory
    currentUser.inventory.racks = tempRacks;
    currentUser.inventory.motherboards = tempMbs;
    currentUser.inventory.cpus = tempCpus;
    currentUser.inventory.psus = tempPsus;
    currentUser.inventory.gpus = tempGpus;

    // Calculate total hashrate & power
    let totalHash = 0;
    let totalPower = 100; // base system power

    config.gpuIds.forEach((gpuId) => {
      const gpuItem = getHardwareById(gpuId);
      if (gpuItem) {
        totalHash += gpuItem.specs.hashrates[config.targetCoin] || 0;
        totalPower += gpuItem.powerWatts;
      }
    });

    const newRig: MiningRig = {
      id: `rig-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: config.name,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      status: 'mining',
      targetCoin: config.targetCoin,
      targetWalletAddress: config.targetWalletAddress,
      poolId: config.poolId,
      rackId: config.rackId,
      motherboardId: config.motherboardId,
      cpuId: config.cpuId,
      psuIds: config.psuIds,
      gpuIds: config.gpuIds,
      totalHashrate: Number(totalHash.toFixed(2)),
      totalPowerWatts: totalPower,
      temperature: 58 + Math.floor(Math.random() * 8),
      fanSpeedRPM: 2100 + Math.floor(Math.random() * 400),
      overclockPercent: 0,
      createdAt: Date.now(),
      lastPayoutTime: Date.now(),
    };

    saveSingleRig(newRig);
    saveUser(currentUser);

    logTransaction({
      type: 'mining_payout',
      amount: 0,
      currency: config.targetCoin,
      description: `Собрана и запущена ферма «${config.name}» (${totalHash.toFixed(1)} MH/s) на ${config.poolId}`,
    });

    refreshUserData();
    setActiveTab('myrigs');
    return true;
  };

  // 5. Rig Operations (Toggle, Dismantle, Overclock, Config)
  const handleToggleRigStatus = (rigId: string) => {
    const rigList = getAllRigs();
    const rig = rigList.find((r) => r.id === rigId);
    if (!rig) return;

    rig.status = rig.status === 'mining' ? 'paused' : 'mining';
    saveRigs(rigList);
    setRigs(rigList);
  };

  const handleDismantleRig = (rigId: string) => {
    const rigList = getAllRigs();
    const rig = rigList.find((r) => r.id === rigId);
    if (!rig) return;

    // Return components back to user inventory
    const inv = currentUser.inventory;
    inv.racks.push(rig.rackId);
    inv.motherboards.push(rig.motherboardId);
    inv.cpus.push(rig.cpuId);
    rig.psuIds.forEach((p) => inv.psus.push(p));
    rig.gpuIds.forEach((g) => inv.gpus.push(g));

    deleteRig(rigId);
    saveUser(currentUser);
    refreshUserData();
  };

  const handleUpdateOverclock = (rigId: string, percent: number) => {
    const rigList = getAllRigs();
    const rig = rigList.find((r) => r.id === rigId);
    if (!rig) return;

    rig.overclockPercent = percent;
    saveRigs(rigList);
    setRigs(rigList);
  };

  const handleUpdateRigConfig = (rigId: string, coin: CoinSymbol, targetAddress: string, poolId: string) => {
    const rigList = getAllRigs();
    const rig = rigList.find((r) => r.id === rigId);
    if (!rig) return;

    rig.targetCoin = coin;
    rig.targetWalletAddress = targetAddress;
    rig.poolId = poolId;
    saveRigs(rigList);
    setRigs(rigList);
  };

  // 6. Exchange Trading
  const handleTrade = (
    action: 'BUY' | 'SELL',
    coin: CoinSymbol,
    coinAmount: number,
    totalUSDT: number
  ): boolean => {
    if (action === 'BUY') {
      if ((currentUser.cryptoBalances.USDT || 0) < totalUSDT) return false;
      currentUser.cryptoBalances.USDT -= totalUSDT;
      currentUser.cryptoBalances[coin] = (currentUser.cryptoBalances[coin] || 0) + coinAmount;
    } else {
      if ((currentUser.cryptoBalances[coin] || 0) < coinAmount) return false;
      currentUser.cryptoBalances[coin] -= coinAmount;
      currentUser.cryptoBalances.USDT = (currentUser.cryptoBalances.USDT || 0) + totalUSDT;
    }

    saveUser(currentUser);
    logTransaction({
      type: 'currency_exchange',
      amount: action === 'BUY' ? coinAmount : totalUSDT,
      currency: action === 'BUY' ? coin : 'USDT',
      description: action === 'BUY'
        ? `Покупка ${coinAmount} ${coin} за ${totalUSDT.toFixed(2)} USDT`
        : `Продажа ${coinAmount} ${coin} за +${totalUSDT.toFixed(2)} USDT`,
    });

    refreshUserData();
    return true;
  };

  // 7. Create Custom Mining Pool
  const handleCreatePool = (name: string, host: string, feePercent: number): boolean => {
    const POOL_COST = 10000;
    if (currentUser.cryptoBalances.USDT >= POOL_COST) {
      currentUser.cryptoBalances.USDT -= POOL_COST;
    } else if (currentUser.bankBalanceUSD >= POOL_COST) {
      currentUser.bankBalanceUSD -= POOL_COST;
    } else {
      return false;
    }

    const newPool: MiningPool = {
      id: host.toLowerCase(),
      name,
      host: host.toLowerCase(),
      feePercent,
      creatorId: currentUser.id,
      creatorUsername: currentUser.username,
      creatorWalletAddress: currentUser.cryptoAddresses.USDT,
      totalHashrate: 1200.0,
      activeMinersCount: 5,
      totalFeesEarnedUSDT: 0,
      createdAt: Date.now(),
      isSystem: false,
    };

    savePool(newPool);
    currentUser.createdPoolIds.push(newPool.id);
    saveUser(currentUser);

    logTransaction({
      type: 'hardware_purchase',
      amount: -POOL_COST,
      currency: 'USDT',
      description: `Создание собственного майнинг пула: ${name} (${host})`,
    });

    refreshUserData();
    return true;
  };

  // 8. Business Upgrades & Purchases
  const handleBuyBusiness = (templateId: string): boolean => {
    const template = BUSINESS_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return false;
    if (currentUser.bankBalanceUSD < template.baseCostUSD) return false;

    currentUser.bankBalanceUSD -= template.baseCostUSD;
    currentUser.businesses.push({
      businessId: templateId,
      level: 1,
      staffCount: 1,
      marketingLevel: 1,
      automationUnlocked: true,
      lastCollectedTime: Date.now(),
    });

    saveUser(currentUser);
    logTransaction({
      type: 'hardware_purchase',
      amount: -template.baseCostUSD,
      currency: 'USD',
      description: `Приобретение бизнеса: ${template.name}`,
    });

    refreshUserData();
    return true;
  };

  const handleUpgradeBusiness = (templateId: string): boolean => {
    const userBiz = currentUser.businesses.find((b) => b.businessId === templateId);
    const template = BUSINESS_TEMPLATES.find((t) => t.id === templateId);
    if (!userBiz || !template) return false;

    const cost = calculateUpgradeCost(template, userBiz.level);
    if (currentUser.bankBalanceUSD < cost) return false;

    currentUser.bankBalanceUSD -= cost;
    userBiz.level += 1;
    saveUser(currentUser);

    logTransaction({
      type: 'hardware_purchase',
      amount: -cost,
      currency: 'USD',
      description: `Улучшение уровня бизнеса: ${template.name} до Lvl ${userBiz.level}`,
    });

    refreshUserData();
    return true;
  };

  const handleHireStaff = (templateId: string): boolean => {
    const userBiz = currentUser.businesses.find((b) => b.businessId === templateId);
    if (!userBiz) return false;

    const cost = calculateStaffCost(userBiz.staffCount);
    if (currentUser.bankBalanceUSD < cost) return false;

    currentUser.bankBalanceUSD -= cost;
    userBiz.staffCount += 1;
    saveUser(currentUser);

    refreshUserData();
    return true;
  };

  const handleUpgradeMarketing = (templateId: string): boolean => {
    const userBiz = currentUser.businesses.find((b) => b.businessId === templateId);
    if (!userBiz) return false;

    const cost = calculateMarketingCost(userBiz.marketingLevel);
    if (currentUser.bankBalanceUSD < cost) return false;

    currentUser.bankBalanceUSD -= cost;
    userBiz.marketingLevel += 1;
    saveUser(currentUser);

    refreshUserData();
    return true;
  };

  const handleToggleAutomation = (templateId: string): boolean => {
    const userBiz = currentUser.businesses.find((b) => b.businessId === templateId);
    if (!userBiz) return false;
    userBiz.automationUnlocked = !userBiz.automationUnlocked;
    saveUser(currentUser);
    refreshUserData();
    return true;
  };

  const handleRenameRig = (rigId: string, newName: string) => {
    renameMiningRig(rigId, newName);
    setRigs(getAllRigs());
  };

  const handleUpdateCardPin = (newPin: string) => {
    updateCardPin(currentUser.id, newPin);
    refreshUserData();
  };

  const handleTopUpFromOtherCard = (targetCardNumber: string, targetPin: string, amount: number) => {
    const res = topUpFromOtherCard(currentUser.id, targetCardNumber, targetPin, amount);
    refreshUserData();
    return res;
  };

  const handleBuyHackerPc = (templateId: number) => {
    const res = purchaseHackerPc(currentUser.id, templateId);
    refreshUserData();
    return res;
  };

  const handleStartBruteForce = (pcInstanceId: string, targetCardNumber: string, targetUsername: string) => {
    const res = startBruteForceJob(currentUser.id, pcInstanceId, targetCardNumber, targetUsername);
    refreshUserData();
    return res;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] flex flex-col font-sans selection:bg-green-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalNetworkHashrate={totalNetworkHashrate}
        onSwitchUser={() => setShowAuthModal(true)}
        allUsers={allUsers}
        onSelectUser={(id) => {
          setCurrentUserId(id);
          refreshUserData();
        }}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-10">
        {activeTab === 'bank' && (
          <BankView
            key={`bank-${currentUser.id}-${prefilledTopUpCard}`}
            currentUser={currentUser}
            onSendUSD={handleSendUSD}
            onConvertUsdUsdt={handleConvertUsdUsdt}
            onUpdateCardPin={handleUpdateCardPin}
            onTopUpFromOtherCard={handleTopUpFromOtherCard}
            initialTopUpCardNumber={prefilledTopUpCard}
            initialTopUpPin={prefilledTopUpPin}
            transactions={transactions}
            allUsers={allUsers}
          />
        )}

        {activeTab === 'wallet' && (
          <CryptoWalletView
            key={`wallet-${currentUser.id}`}
            currentUser={currentUser}
            allUsers={allUsers}
            allRigs={rigs}
            marketPrices={marketPrices}
            onSendCrypto={handleSendCrypto}
          />
        )}

        {activeTab === 'builder' && (
          <RigBuilderView
            key={`builder-${currentUser.id}`}
            currentUser={currentUser}
            allUsers={allUsers}
            pools={pools}
            onDeployRig={handleDeployRig}
            onNavigateToStore={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'myrigs' && (
          <MyRigsView
            key={`myrigs-${currentUser.id}`}
            currentUser={currentUser}
            rigs={rigs}
            pools={pools}
            onToggleRigStatus={handleToggleRigStatus}
            onDismantleRig={handleDismantleRig}
            onUpdateOverclock={handleUpdateOverclock}
            onUpdateRigConfig={handleUpdateRigConfig}
            onRenameRig={handleRenameRig}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'store' && (
          <HardwareStoreView
            key={`store-${currentUser.id}`}
            currentUser={currentUser}
            onBuyItem={handleBuyHardware}
          />
        )}

        {activeTab === 'exchange' && (
          <CryptoExchangeView
            key={`exchange-${currentUser.id}`}
            currentUser={currentUser}
            marketPrices={marketPrices}
            onTrade={handleTrade}
          />
        )}

        {activeTab === 'pools' && (
          <PoolsView
            key={`pools-${currentUser.id}`}
            currentUser={currentUser}
            pools={pools}
            rigs={rigs}
            marketPrices={marketPrices}
            allUsers={allUsers}
            onCreatePool={handleCreatePool}
          />
        )}

        {activeTab === 'businesses' && (
          <BusinessesView
            key={`businesses-${currentUser.id}`}
            currentUser={currentUser}
            onBuyBusiness={handleBuyBusiness}
            onUpgradeBusiness={handleUpgradeBusiness}
            onHireStaff={handleHireStaff}
            onUpgradeMarketing={handleUpgradeMarketing}
            onToggleAutomation={handleToggleAutomation}
          />
        )}

        {activeTab === 'hackerpc' && (
          <HackerPcView
            key={`hackerpc-${currentUser.id}`}
            currentUser={currentUser}
            allUsers={allUsers}
            onBuyHackerPc={handleBuyHackerPc}
            onStartBruteForce={handleStartBruteForce}
            onRefreshUser={refreshUserData}
            onNavigateToBankWithCard={(cardNumber, pin) => {
              setPrefilledTopUpCard(cardNumber);
              setPrefilledTopUpPin(pin);
              setActiveTab('bank');
            }}
          />
        )}

        {activeTab === 'multiplayer' && (
          <MultiplayerView
            key={`multiplayer-${currentUser.id}`}
            currentUser={currentUser}
            allUsers={allUsers}
            rigs={rigs}
            marketPrices={marketPrices}
            onQuickTransferUSD={(cardNumber) => {
              setActiveTab('bank');
            }}
            onQuickSendCrypto={(addr, coin) => {
              setActiveTab('wallet');
            }}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {activeTab === 'admin' && currentUser.username.toLowerCase() === 'fixcat' && (
          <AdminPanelView
            key={`admin-${currentUser.id}`}
            currentUser={currentUser}
            allUsers={allUsers}
            pools={pools}
            rigs={rigs}
            marketPrices={marketPrices}
            onRefreshData={refreshUserData}
            onFullReset={() => {
              fullSystemReset();
              setCurrentUser(null);
              window.location.reload();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d2d33] bg-[#0a0a0b] py-4 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Apex Global Mining & Banking Simulator © 2026</span>
          <span className="text-zinc-400">Stratum: us.fixms.mine:3333 • High Density Terminal Engine</span>
        </div>
      </footer>

      {/* Auth & New User Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onUserCreated={(newUser) => {
          refreshUserData();
        }}
      />

      {/* Real-time Banned User Modal Overlay */}
      {currentUser && currentUser.isBanned && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="bg-[#151518] border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(239,68,68,0.35)] text-center space-y-5 animate-in fade-in zoom-in">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500 flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
                Вы были заблокированы
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Ваш аккаунт заблокирован администратором. Все ваши средства распределены между активными игроками. Аккаунт будет окончательно удален из базы через 10 минут.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentUserId('');
                  setCurrentUser(null);
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
