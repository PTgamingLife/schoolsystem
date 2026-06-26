import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  Edit3,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';
import './styles.css';

const classrooms = [
  {
    id: 'E-101',
    name: '工一 101',
    campus: '光復校區',
    building: '工程一館',
    floor: '1 樓',
    type: '一般教室',
    capacity: 48,
    manager: '總務處',
    equipment: ['投影機', '白板', '麥克風'],
    open: true,
  },
  {
    id: 'E-102',
    name: '工一 102',
    campus: '光復校區',
    building: '工程一館',
    floor: '1 樓',
    type: '一般教室',
    capacity: 60,
    manager: '總務處',
    equipment: ['投影機', '電腦', '麥克風', '白板', '冷氣'],
    open: true,
  },
  {
    id: 'E-103',
    name: '工一 103',
    campus: '光復校區',
    building: '工程一館',
    floor: '2 樓',
    type: '階梯教室',
    capacity: 72,
    manager: '教務處',
    equipment: ['投影機', '錄影設備', '白板'],
    open: true,
  },
  {
    id: 'E-105',
    name: '工一 105',
    campus: '光復校區',
    building: '工程一館',
    floor: '2 樓',
    type: '大型教室',
    capacity: 120,
    manager: '總務處',
    equipment: ['雙投影', '麥克風', '講台電腦'],
    open: true,
  },
  {
    id: 'S-201',
    name: '科一 201',
    campus: '光復校區',
    building: '科學一館',
    floor: '2 樓',
    type: '研討教室',
    capacity: 80,
    manager: '教務處',
    equipment: ['投影機', '視訊設備', '白板'],
    open: false,
  },
];

const timeSlots = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00'];

const unavailable = {
  'E-105': ['08:00 - 10:00', '10:00 - 12:00'],
  'E-103': ['13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00'],
  'S-201': ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00'],
};

const seedBookings = [
  {
    id: 'CB2606001',
    createdAt: '2026/06/01',
    bookingDate: '2026/06/05',
    applicant: '王小明',
    department: '總務處 行政組',
    phone: '03-5712121 #50000',
    email: 'xiaoming.wang@nycu.edu.tw',
    roomId: 'E-102',
    room: '工一 102',
    time: '13:00 - 15:00',
    purpose: '行政會議',
    attendees: 35,
    status: '待簽核',
    handler: '李建國',
    formNo: 'FORM-2606001',
  },
  {
    id: 'CB2606056',
    createdAt: '2026/06/03',
    bookingDate: '2026/06/10',
    applicant: '張雅婷',
    department: '教務處',
    phone: '03-5712121 #31200',
    email: 'yating.chang@nycu.edu.tw',
    roomId: 'S-201',
    room: '科一 201',
    time: '09:00 - 11:00',
    purpose: '專題演講',
    attendees: 80,
    status: '已核准',
    handler: '李建國',
    formNo: 'FORM-2606056',
  },
  {
    id: 'CB2605042',
    createdAt: '2026/06/05',
    bookingDate: '2026/06/12',
    applicant: '陳志宏',
    department: '資訊學院',
    phone: '03-5712121 #56010',
    email: 'chihung.chen@nycu.edu.tw',
    roomId: 'E-105',
    room: '工一 105',
    time: '15:00 - 17:00',
    purpose: '系所活動',
    attendees: 120,
    status: '需補件',
    handler: '李建國',
    formNo: 'FORM-2605042',
  },
  {
    id: 'CB2607008',
    createdAt: '2026/06/08',
    bookingDate: '2026/06/18',
    applicant: '林怡君',
    department: '管理學院',
    phone: '03-5712121 #57022',
    email: 'yijun.lin@nycu.edu.tw',
    roomId: 'E-101',
    room: '工一 101',
    time: '10:00 - 12:00',
    purpose: '工作坊',
    attendees: 42,
    status: '已取消',
    handler: '系統',
    formNo: 'FORM-2607008',
  },
];

const adminPages = [
  ['總覽', LayoutDashboard],
  ['預訂名單', FileText],
  ['申請人名單', Users],
  ['教室資料', Building2],
  ['簽核紀錄', ClipboardCheck],
  ['表單匯出', Download],
  ['系統設定', Settings],
];

const utilization = [
  ['06/22', '一', 72],
  ['06/23', '二', 58],
  ['06/24', '三', 83],
  ['06/25', '四', 64],
  ['06/26', '五', 41],
  ['06/27', '六', 28],
  ['06/28', '日', 21],
];

function App() {
  const [mode, setMode] = useState('front');
  const [adminPage, setAdminPage] = useState('總覽');
  const [selectedRoomId, setSelectedRoomId] = useState('E-102');
  const [selectedSlot, setSelectedSlot] = useState('13:00 - 15:00');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [bookings, setBookings] = useState(seedBookings);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    applicant: '王小明',
    department: '總務處 行政組',
    phone: '03-5712121 #50000',
    email: 'xiaoming.wang@nycu.edu.tw',
    purpose: '行政會議',
    attendees: '35',
    note: '',
  });

  const selectedRoom = classrooms.find((room) => room.id === selectedRoomId);
  const filteredBookings = statusFilter === '全部' ? bookings : bookings.filter((booking) => booking.status === statusFilter);
  const applicants = useMemo(() => {
    const map = new Map();
    bookings.forEach((booking) => {
      map.set(booking.email, {
        name: booking.applicant,
        department: booking.department,
        phone: booking.phone,
        email: booking.email,
        count: (map.get(booking.email)?.count || 0) + 1,
        latest: booking.createdAt,
      });
    });
    return [...map.values()];
  }, [bookings]);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((booking) => booking.status === '待簽核').length,
    approved: bookings.filter((booking) => booking.status === '已核准').length,
    needsInfo: bookings.filter((booking) => booking.status === '需補件').length,
  };

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitBooking() {
    const serial = String(bookings.length + 601).padStart(5, '0');
    const nextBooking = {
      id: `CB26${serial}`,
      createdAt: '2026/06/26',
      bookingDate: '2026/06/26',
      applicant: form.applicant,
      department: form.department,
      phone: form.phone,
      email: form.email,
      roomId: selectedRoom.id,
      room: selectedRoom.name,
      time: selectedSlot,
      purpose: form.purpose,
      attendees: Number(form.attendees || 0),
      status: '待簽核',
      handler: '未指派',
      formNo: `FORM-26${serial}`,
    };
    setBookings((current) => [nextBooking, ...current]);
    setMode('admin');
    setAdminPage('預訂名單');
    setStatusFilter('待簽核');
    flash('預訂申請已送出，後臺已新增一筆待簽核訂單。');
  }

  function setBookingStatus(id, status) {
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status, handler: '李建國' } : booking)));
    flash(`訂單 ${id} 已更新為「${status}」。`);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">交</div>
          <div>
            <strong>國立陽明交通大學</strong>
            <span>教室預訂系統 Demo</span>
          </div>
        </div>

        <div className="mode-switch">
          <button className={mode === 'front' ? 'mode active' : 'mode'} onClick={() => setMode('front')}>
            <Home size={16} />
            前臺預訂
          </button>
          <button className={mode === 'admin' ? 'mode active' : 'mode'} onClick={() => setMode('admin')}>
            <ShieldCheck size={16} />
            後臺管理
          </button>
        </div>

        {mode === 'admin' && (
          <nav className="nav-list">
            {adminPages.map(([label, Icon]) => (
              <button className={adminPage === label ? 'nav-item active' : 'nav-item'} key={label} onClick={() => setAdminPage(label)}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        )}

        <div className="sidebar-summary">
          <span>目前待簽核</span>
          <strong>{counts.pending}</strong>
          <small>筆預訂需要處理</small>
        </div>
      </aside>

      <main className="workspace">
        <Header mode={mode} adminPage={adminPage} />
        {toast && <div className="toast">{toast}</div>}

        {mode === 'front' ? (
          <FrontDesk
            form={form}
            selectedRoom={selectedRoom}
            selectedRoomId={selectedRoomId}
            selectedSlot={selectedSlot}
            onField={updateField}
            onRoom={setSelectedRoomId}
            onSlot={setSelectedSlot}
            onSubmit={submitBooking}
          />
        ) : (
          <AdminDesk
            page={adminPage}
            bookings={bookings}
            filteredBookings={filteredBookings}
            applicants={applicants}
            counts={counts}
            statusFilter={statusFilter}
            onFilter={setStatusFilter}
            onStatus={setBookingStatus}
            onPage={setAdminPage}
          />
        )}
      </main>
    </div>
  );
}

function Header({ mode, adminPage }) {
  return (
    <header className="topbar">
      <div>
        <h1>{mode === 'front' ? '教室預訂前臺' : `後臺管理 / ${adminPage}`}</h1>
        <p>{mode === 'front' ? '使用者查詢可用教室、填寫資料並送出預訂申請。' : '行政人員集中管理訂單、名單、教室、簽核與表單資料。'}</p>
      </div>
      <div className="top-actions">
        <button className="icon-button" aria-label="通知">
          <Bell size={18} />
        </button>
        <div className="admin-profile">
          <div className="avatar">王</div>
          <div>
            <strong>王小明</strong>
            <span>{mode === 'front' ? '申請人示範' : '總務處 行政組'}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

function FrontDesk({ form, selectedRoom, selectedRoomId, selectedSlot, onField, onRoom, onSlot, onSubmit }) {
  return (
    <>
      <section className="plain-hero">
        <div>
          <h2>快速預訂校內教室</h2>
          <p>選擇教室與時段後送出申請，後臺會自動建立待簽核訂單與表單資料。</p>
        </div>
        <div className="hero-summary">
          <strong>{classrooms.filter((room) => room.open).length}</strong>
          <span>間可開放預訂教室</span>
        </div>
      </section>

      <section className="panel">
        <SectionHeading title="1. 搜尋教室" note="demo 版資料為固定假資料，可先確認頁面形式與操作方式" />
        <div className="filter-grid">
          <Field label="校區">
            <Select value="光復校區" options={['光復校區', '陽明校區', '博愛校區']} />
          </Field>
          <Field label="建築物">
            <Select value="工程一館" options={['工程一館', '科學一館', '管理二館']} />
          </Field>
          <Field label="教室類型">
            <Select value="一般教室" options={['一般教室', '階梯教室', '研討教室']} />
          </Field>
          <Field label="容納人數">
            <Select value="不限" options={['不限', '50 人以上', '80 人以上', '100 人以上']} />
          </Field>
          <Field label="日期">
            <div className="text-input with-icon">
              2026/06/26（五）
              <CalendarDays size={16} />
            </div>
          </Field>
          <Field label="關鍵字">
            <input className="text-input" placeholder="教室名稱或代碼" />
          </Field>
          <button className="primary-button">
            <Search size={16} />
            搜尋
          </button>
          <button className="secondary-button">重設</button>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel timeslot-panel">
          <SectionHeading title="2. 選擇時段" note="○ 可預訂　× 已佔用" inline />
          <Schedule selectedRoomId={selectedRoomId} selectedSlot={selectedSlot} onRoom={onRoom} onSlot={onSlot} />
        </section>

        <aside className="room-detail">
          <RoomCard room={selectedRoom} selectedSlot={selectedSlot} />
          <UtilizationCard />
        </aside>
      </div>

      <section className="panel">
        <SectionHeading title="3. 填寫預訂資料" note="送出後會進入後臺待簽核名單" />
        <BookingForm form={form} onField={onField} />
        <div className="form-actions">
          <button className="primary-button large" onClick={onSubmit}>
            送出預訂申請
          </button>
          <button className="secondary-button large">暫存草稿</button>
        </div>
      </section>
    </>
  );
}

function AdminDesk({ page, bookings, filteredBookings, applicants, counts, statusFilter, onFilter, onStatus, onPage }) {
  if (page === '總覽') {
    return <AdminOverview counts={counts} bookings={bookings} onPage={onPage} onStatus={onStatus} />;
  }

  if (page === '申請人名單') {
    return <Applicants applicants={applicants} />;
  }

  if (page === '教室資料') {
    return <ClassroomList />;
  }

  if (page === '簽核紀錄') {
    return <ApprovalLogs bookings={bookings} />;
  }

  if (page === '表單匯出') {
    return <FormExports bookings={bookings} />;
  }

  if (page === '系統設定') {
    return <SystemSettings />;
  }

  return <BookingList bookings={filteredBookings} statusFilter={statusFilter} onFilter={onFilter} onStatus={onStatus} />;
}

function AdminOverview({ counts, bookings, onPage, onStatus }) {
  return (
    <>
      <div className="kpi-grid">
        <Kpi title="全部訂單" value={counts.all} icon={FileText} />
        <Kpi title="待簽核" value={counts.pending} icon={ClipboardCheck} tone="amber" />
        <Kpi title="已核准" value={counts.approved} icon={CheckCircle2} tone="green" />
        <Kpi title="需補件" value={counts.needsInfo} icon={ListChecks} tone="red" />
      </div>
      <div className="content-grid">
        <section className="panel">
          <SectionHeading title="最近待處理訂單" note="demo 按鈕可直接改變狀態" inline />
          <BookingRows bookings={bookings.slice(0, 4)} onStatus={onStatus} compact />
          <button className="secondary-button compact" onClick={() => onPage('預訂名單')}>查看全部訂單</button>
        </section>
        <UtilizationCard />
      </div>
    </>
  );
}

function BookingList({ bookings, statusFilter, onFilter, onStatus }) {
  return (
    <section className="panel">
      <div className="section-title-row">
        <SectionHeading title="預訂名單" note="所有前臺送出的申請都集中在此管理" />
        <button className="secondary-button">
          <Download size={16} />
          匯出表單
        </button>
      </div>
      <div className="order-toolbar">
        <Field label="狀態">
          <Select value={statusFilter} onChange={onFilter} options={['全部', '待簽核', '已核准', '需補件', '已取消']} />
        </Field>
        <Field label="申請期間">
          <div className="date-range">
            <span>2026/06/01</span>
            <span>－</span>
            <span>2026/06/30</span>
          </div>
        </Field>
        <Field label="關鍵字" wide>
          <input className="text-input" placeholder="申請人、教室或用途" />
        </Field>
        <button className="primary-button">
          <Search size={16} />
          搜尋
        </button>
      </div>
      <BookingRows bookings={bookings} onStatus={onStatus} />
      <Pagination count={bookings.length} />
    </section>
  );
}

function BookingRows({ bookings, onStatus, compact = false }) {
  return (
    <div className="orders-table">
      <div className="orders-row orders-head">
        <div>訂單編號</div>
        <div>申請日</div>
        <div>申請人</div>
        <div>教室</div>
        <div>日期</div>
        <div>時段</div>
        <div>用途</div>
        <div>人數</div>
        <div>狀態</div>
        <div>操作</div>
      </div>
      {bookings.map((booking) => (
        <div className="orders-row" key={booking.id}>
          <div>{booking.id}</div>
          <div>{booking.createdAt}</div>
          <div>{booking.applicant}</div>
          <div>{booking.room}</div>
          <div>{booking.bookingDate}</div>
          <div>{booking.time}</div>
          <div>{booking.purpose}</div>
          <div>{booking.attendees}</div>
          <div>
            <StatusLabel status={booking.status} />
          </div>
          <div className="row-actions">
            <button className="text-button">
              <Edit3 size={15} />
              編輯
            </button>
            {booking.status !== '已核准' && (
              <button className="approve-button" onClick={() => onStatus(booking.id, '已核准')}>
                <CheckCircle2 size={15} />
                核准
              </button>
            )}
            {!compact && booking.status !== '需補件' && (
              <button className="text-button danger" onClick={() => onStatus(booking.id, '需補件')}>
                補件
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Applicants({ applicants }) {
  return (
    <section className="panel">
      <SectionHeading title="申請人名單" note="後臺集中管理所有預訂者資料" />
      <div className="list-table applicant-table">
        <div className="list-row list-head">
          <div>姓名</div>
          <div>單位</div>
          <div>電話</div>
          <div>Email</div>
          <div>申請次數</div>
          <div>最近申請</div>
        </div>
        {applicants.map((applicant) => (
          <div className="list-row" key={applicant.email}>
            <div>{applicant.name}</div>
            <div>{applicant.department}</div>
            <div>{applicant.phone}</div>
            <div>{applicant.email}</div>
            <div>{applicant.count}</div>
            <div>{applicant.latest}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClassroomList() {
  return (
    <section className="panel">
      <SectionHeading title="教室資料" note="demo 版先用固定教室資料，正式版可改成後臺新增與停用" />
      <div className="classroom-grid">
        {classrooms.map((room) => (
          <article className="classroom-card" key={room.id}>
            <div className="card-title-row">
              <h3>{room.name}</h3>
              <StatusLabel status={room.open ? '開放' : '停用'} />
            </div>
            <Info icon={MapPin} label="地點" value={`${room.campus} / ${room.building} ${room.floor}`} />
            <Info icon={Users} label="容量" value={`${room.capacity} 人`} />
            <Info icon={Building2} label="類型" value={room.type} />
            <Info icon={Settings} label="設備" value={room.equipment.join('、')} />
            <button className="secondary-button compact">編輯教室</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApprovalLogs({ bookings }) {
  const logs = bookings.flatMap((booking) => [
    { id: `${booking.id}-create`, time: `${booking.createdAt} 09:20`, order: booking.id, actor: booking.applicant, action: '送出申請', note: booking.purpose },
    { id: `${booking.id}-review`, time: `${booking.createdAt} 14:10`, order: booking.id, actor: booking.handler, action: booking.status, note: booking.status === '需補件' ? '請補活動企劃書' : 'demo 簽核紀錄' },
  ]);

  return (
    <section className="panel">
      <SectionHeading title="簽核紀錄" note="每一次送出、核准、退回補件都應留下紀錄" />
      <div className="list-table log-table">
        <div className="list-row list-head">
          <div>時間</div>
          <div>訂單</div>
          <div>處理人</div>
          <div>動作</div>
          <div>備註</div>
        </div>
        {logs.map((log) => (
          <div className="list-row" key={log.id}>
            <div>{log.time}</div>
            <div>{log.order}</div>
            <div>{log.actor}</div>
            <div>{log.action}</div>
            <div>{log.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormExports({ bookings }) {
  return (
    <section className="panel">
      <SectionHeading title="表單匯出" note="正式版可產生 PDF、Excel 或串接校內簽核系統" />
      <div className="list-table export-table">
        <div className="list-row list-head">
          <div>表單編號</div>
          <div>訂單編號</div>
          <div>申請人</div>
          <div>教室與時段</div>
          <div>狀態</div>
          <div>操作</div>
        </div>
        {bookings.map((booking) => (
          <div className="list-row" key={booking.formNo}>
            <div>{booking.formNo}</div>
            <div>{booking.id}</div>
            <div>{booking.applicant}</div>
            <div>{booking.room} / {booking.time}</div>
            <div>
              <StatusLabel status={booking.status} />
            </div>
            <div>
              <button className="secondary-button compact">
                <Download size={15} />
                下載
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SystemSettings() {
  return (
    <section className="panel">
      <SectionHeading title="系統設定" note="demo 先呈現設定頁形式，正式版再接資料庫" />
      <div className="settings-grid">
        <Setting title="預訂規則" items={['每次預訂以 2 小時為單位', '需提前 3 個工作天申請', '週末預訂需人工審核']} />
        <Setting title="簽核流程" items={['承辦人初審', '單位主管覆核', '核准後寄送通知']} />
        <Setting title="通知管道" items={['Email 通知申請人', '後臺通知管理者', '補件時保留處理紀錄']} />
      </div>
    </section>
  );
}

function Schedule({ selectedRoomId, selectedSlot, onRoom, onSlot }) {
  return (
    <div className="schedule-table" role="table">
      <div className="schedule-row schedule-head" role="row">
        <div>時間</div>
        {classrooms.map((room) => (
          <div key={room.id}>{room.name}</div>
        ))}
      </div>
      {timeSlots.map((slot) => (
        <div className="schedule-row" role="row" key={slot}>
          <div>{slot}</div>
          {classrooms.map((room) => {
            const blocked = unavailable[room.id]?.includes(slot) || !room.open;
            const selected = selectedRoomId === room.id && selectedSlot === slot;
            return (
              <button
                className={selected ? 'slot-cell selected' : 'slot-cell'}
                disabled={blocked}
                key={`${room.id}-${slot}`}
                onClick={() => {
                  onRoom(room.id);
                  onSlot(slot);
                }}
                aria-label={`${room.name} ${slot}`}
              >
                {blocked ? <X size={17} /> : selected ? <Check size={17} /> : <span className="open-dot" />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function RoomCard({ room, selectedSlot }) {
  return (
    <div className="panel detail-card">
      <span className="eyebrow">已選擇的教室</span>
      <h3>{room.name} 教室</h3>
      <Info icon={Building2} label="校區" value={room.campus} />
      <Info icon={MapPin} label="地點" value={`${room.building} ${room.floor}`} />
      <Info icon={Users} label="容納人數" value={`${room.capacity} 人`} />
      <Info icon={LayoutDashboard} label="設備" value={room.equipment.join('、')} />
      <Info icon={CalendarDays} label="時段" value={`2026/06/26（五） ${selectedSlot}`} />
    </div>
  );
}

function UtilizationCard() {
  return (
    <div className="panel chart-card">
      <SectionHeading title="教室使用率" note="本週" inline />
      <div className="chart">
        {utilization.map(([date, day, value]) => (
          <div className="bar-group" key={date}>
            <div className="bar-track">
              <div className={date === '06/25' ? 'bar active' : 'bar'} style={{ height: `${value}%` }} />
            </div>
            <strong>{value}%</strong>
            <span>{date}</span>
            <small>{day}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingForm({ form, onField }) {
  return (
    <div className="form-grid">
      <Field label="申請人姓名 *">
        <input className="text-input" value={form.applicant} onChange={(event) => onField('applicant', event.target.value)} />
      </Field>
      <Field label="所屬單位 *">
        <input className="text-input" value={form.department} onChange={(event) => onField('department', event.target.value)} />
      </Field>
      <Field label="聯絡電話 *">
        <input className="text-input" value={form.phone} onChange={(event) => onField('phone', event.target.value)} />
      </Field>
      <Field label="電子郵件 *">
        <input className="text-input" value={form.email} onChange={(event) => onField('email', event.target.value)} />
      </Field>
      <Field label="活動用途 / 課程名稱 *" wide>
        <input className="text-input" value={form.purpose} onChange={(event) => onField('purpose', event.target.value)} />
      </Field>
      <Field label="預估參與人數 *">
        <input className="text-input" value={form.attendees} onChange={(event) => onField('attendees', event.target.value)} />
      </Field>
      <Field label="備註" wide>
        <textarea className="text-area" placeholder="如有特殊需求請說明（選填）" value={form.note} onChange={(event) => onField('note', event.target.value)} />
      </Field>
    </div>
  );
}

function Kpi({ title, value, icon: Icon, tone = 'blue' }) {
  return (
    <article className={`kpi ${tone}`}>
      <Icon size={22} />
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function Setting({ title, items }) {
  return (
    <article className="setting-card">
      <h3>{title}</h3>
      {items.map((item) => (
        <label key={item} className="check-row">
          <input type="checkbox" defaultChecked />
          <span>{item}</span>
        </label>
      ))}
    </article>
  );
}

function Field({ label, children, wide }) {
  return (
    <label className={wide ? 'field wide' : 'field'}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Select({ value, options, onChange }) {
  return (
    <div className="select-wrap">
      <select value={value} onChange={(event) => onChange?.(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown size={16} />
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="info-row">
      <Icon size={16} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeading({ title, note, inline = false }) {
  return (
    <div className={inline ? 'section-heading inline' : 'section-heading'}>
      <h2>{title}</h2>
      <span>{note}</span>
    </div>
  );
}

function StatusLabel({ status }) {
  return <span className={`status ${status}`}>{status}</span>;
}

function Pagination({ count }) {
  return (
    <div className="pagination">
      <span>顯示第 1 至 {count} 筆，共 {count} 筆</span>
      <button className="icon-button">
        <ChevronLeft size={16} />
      </button>
      <button className="page-current">1</button>
      <button className="icon-button">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
