import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { RiwayatSkeleton } from './components/Skeleton';
import { AnimatedTabsSimple } from './components/AnimatedTabs';
import { ModalRiwayatMengajar, ModalRiwayatKegiatanPJ, ModalRiwayatKegiatanPendamping, ModalRiwayatRapatPimpinan, ModalRiwayatRapatPeserta, ModalRiwayatRapatSekretaris, ModalTerlewat, ModalIzin } from './components/RiwayatModals';

function Riwayat() {
    // UI States
    const [activeTab, setActiveTab] = useState('mengajar');
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Data states
    const [mengajarData, setMengajarData] = useState([]);
    const [kegiatanData, setKegiatanData] = useState([]);
    const [rapatData, setRapatData] = useState([]);

    // Modal states
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'hadir', 'terlewat', 'izin'
    const [itemCategory, setItemCategory] = useState(null); // 'mengajar', 'kegiatan', 'rapat'

    const tabs = [
        { id: 'mengajar', label: 'Mengajar' },
        { id: 'kegiatan', label: 'Kegiatan' },
        { id: 'rapat', label: 'Rapat' },
    ];

    // Fetch mengajar data
    const fetchMengajarData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/guru-panel/riwayat/mengajar?${params}`);
            if (response.data.success) {
                setMengajarData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching mengajar data:', error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    // Fetch kegiatan data
    const fetchKegiatanData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/guru-panel/riwayat/kegiatan?${params}`);
            if (response.data.success) {
                setKegiatanData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching kegiatan data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch rapat data
    const fetchRapatData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/guru-panel/riwayat/rapat?${params}`);
            if (response.data.success) {
                setRapatData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching rapat data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refs to track initialization
    const isInitialMount = React.useRef(true);
    const hasFetchedInitial = React.useRef(false);

    // useEffect for initial load and tab changes
    useEffect(() => {
        if (activeTab === 'mengajar') {
            if (!hasFetchedInitial.current || !isInitialMount.current) {
                fetchMengajarData();
                hasFetchedInitial.current = true;
            }
        } else if (activeTab === 'kegiatan') {
            fetchKegiatanData();
        } else if (activeTab === 'rapat') {
            fetchRapatData();
        }
        
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, [activeTab]);

    // useEffect for search with debounce
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        
        const timer = setTimeout(() => {
            if (activeTab === 'mengajar') {
                fetchMengajarData();
            } else if (activeTab === 'kegiatan') {
                fetchKegiatanData();
            } else if (activeTab === 'rapat') {
                fetchRapatData();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle card click - determine which modal to show
    const handleCardClick = (item, category) => {
        setSelectedItem(item);
        setItemCategory(category);

        // Determine modal type based on guru_status
        const status = item.guru_status || 'A'; // Default to alpha if no status
        
        if (status === 'H') {
            setModalType('hadir');
        } else if (status === 'I') {
            setModalType('izin');
        } else {
            setModalType('terlewat');
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedItem(null);
        setModalType(null);
        setItemCategory(null);
    };

    // Get status config - matches absensi page style
    const getStatusConfig = (status) => {
        switch (status) {
            case 'H':
                return {
                    border: 'border-green-500',
                    bg: 'bg-green-100',
                    icon: 'text-green-600',
                    label: 'Sudah Absen',
                    labelBg: 'bg-green-100 text-green-700',
                };
            case 'I':
                return {
                    border: 'border-yellow-500',
                    bg: 'bg-yellow-100',
                    icon: 'text-yellow-600',
                    label: 'Izin',
                    labelBg: 'bg-yellow-100 text-yellow-700',
                };
            case 'A':
            default:
                return {
                    border: 'border-red-500',
                    bg: 'bg-red-100',
                    icon: 'text-red-600',
                    label: 'Alpha',
                    labelBg: 'bg-red-100 text-red-700',
                };
        }
    };

    // Show skeleton on initial load
    if (initialLoad) {
        return <RiwayatSkeleton />;
    }

    return (
        <div className="animate-fadeIn">
            {/* Header with Search and Tabs */}
            <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-10 border-b border-gray-100 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Cari riwayat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Tabs */}
                <AnimatedTabsSimple
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Content Area */}
            <div className="p-4">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                )}

                {/* Mengajar Tab */}
                {activeTab === 'mengajar' && !loading && (
                    <>
                        {mengajarData.length > 0 ? (
                            <div className="space-y-3">
                                {mengajarData.map((item) => {
                                    const colors = getStatusConfig(item.guru_status);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleCardClick(item, 'mengajar')}
                                            className={`w-full bg-white rounded-xl shadow-sm p-4 transition-all border-l-4 ${colors.border} cursor-pointer hover:shadow-md`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                    <i className={`fas fa-door-open ${colors.icon}`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    {/* Row 1: Mapel */}
                                                    <p className="font-semibold text-gray-800 truncate">{item.mapel}</p>
                                                    {/* Row 2: Kelas */}
                                                    <p className="text-xs text-gray-500 truncate">{item.kelas}</p>
                                                    {/* Row 3: Tanggal + Time + Status */}
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-gray-400">{item.tanggal}</span>
                                                            <span className="text-[10px] text-gray-400">{item.waktu}</span>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.labelBg}`}>
                                                            {colors.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-chalkboard-teacher text-gray-400 text-2xl"></i>
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada riwayat</p>
                                <p className="text-gray-400 text-sm">Belum ada riwayat mengajar</p>
                            </div>
                        )}
                    </>
                )}

                {/* Kegiatan Tab */}
                {activeTab === 'kegiatan' && !loading && (
                    <>
                        {kegiatanData.length > 0 ? (
                            <div className="space-y-3">
                                {kegiatanData.map((item) => {
                                    const colors = getStatusConfig(item.guru_status);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleCardClick(item, 'kegiatan')}
                                            className={`w-full bg-white rounded-xl shadow-sm p-4 transition-all border-l-4 ${colors.border} cursor-pointer hover:shadow-md`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                    <i className={`fas fa-calendar-check ${colors.icon}`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        <i className="fas fa-map-marker-alt mr-1"></i>{item.lokasi || '-'}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        <div className="flex items-center gap-2">
                                                            {item.role && (
                                                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{item.role}</span>
                                                            )}
                                                            <span className="text-[10px] text-gray-400">{item.tanggal}</span>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.labelBg}`}>
                                                            {colors.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-calendar-check text-gray-400 text-2xl"></i>
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada riwayat</p>
                                <p className="text-gray-400 text-sm">Belum ada riwayat kegiatan</p>
                            </div>
                        )}
                    </>
                )}

                {/* Rapat Tab */}
                {activeTab === 'rapat' && !loading && (
                    <>
                        {rapatData.length > 0 ? (
                            <div className="space-y-3">
                                {rapatData.map((item) => {
                                    const colors = getStatusConfig(item.guru_status);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleCardClick(item, 'rapat')}
                                            className={`w-full bg-white rounded-xl shadow-sm p-4 transition-all border-l-4 ${colors.border} cursor-pointer hover:shadow-md`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                    <i className={`fas fa-users ${colors.icon}`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        <i className="fas fa-map-marker-alt mr-1"></i>{item.lokasi || '-'}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        <div className="flex items-center gap-2">
                                                            {item.role && (
                                                                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">{item.role}</span>
                                                            )}
                                                            <span className="text-[10px] text-gray-400">{item.tanggal}</span>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.labelBg}`}>
                                                            {colors.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-users text-gray-400 text-2xl"></i>
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada riwayat</p>
                                <p className="text-gray-400 text-sm">Belum ada riwayat rapat</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedItem && modalType === 'hadir' && itemCategory === 'mengajar' && (
                <ModalRiwayatMengajar
                    item={selectedItem}
                    onClose={handleCloseModal}
                />
            )}

            {/* Kegiatan modals by role */}
            {selectedItem && modalType === 'hadir' && itemCategory === 'kegiatan' && (selectedItem.role === 'PJ' || selectedItem.role === 'penanggung_jawab') && (
                <ModalRiwayatKegiatanPJ item={selectedItem} onClose={handleCloseModal} />
            )}
            {selectedItem && modalType === 'hadir' && itemCategory === 'kegiatan' && selectedItem.role !== 'PJ' && selectedItem.role !== 'penanggung_jawab' && (
                <ModalRiwayatKegiatanPendamping item={selectedItem} onClose={handleCloseModal} />
            )}

            {/* Rapat modals by role */}
            {selectedItem && modalType === 'hadir' && itemCategory === 'rapat' && selectedItem.role === 'Pimpinan' && (
                <ModalRiwayatRapatPimpinan item={selectedItem} onClose={handleCloseModal} />
            )}
            {selectedItem && modalType === 'hadir' && itemCategory === 'rapat' && selectedItem.role === 'Sekretaris' && (
                <ModalRiwayatRapatSekretaris item={selectedItem} onClose={handleCloseModal} />
            )}
            {selectedItem && modalType === 'hadir' && itemCategory === 'rapat' && selectedItem.role !== 'Pimpinan' && selectedItem.role !== 'Sekretaris' && (
                <ModalRiwayatRapatPeserta item={selectedItem} onClose={handleCloseModal} />
            )}

            {selectedItem && modalType === 'terlewat' && (
                <ModalTerlewat
                    item={selectedItem}
                    type={itemCategory}
                    onClose={handleCloseModal}
                />
            )}

            {selectedItem && modalType === 'izin' && (
                <ModalIzin
                    item={selectedItem}
                    type={itemCategory}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default Riwayat;
