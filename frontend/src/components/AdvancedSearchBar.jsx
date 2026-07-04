import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Minus, Plus, Compass } from 'lucide-react';

const ACCENT = '#00b4d8';
const ACCENT_2 = '#10b981';
const BG_DARK = '#111827';
const BORDER = '#374151';
const TEXT_MUTED = '#9ca3af';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function AdvancedSearchBar({ tours, hotels }) {
  const [activeTab, setActiveTab] = useState(null); // 'where' | 'when' | 'who' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // ---- When (dates) ----
  const today = new Date();
  const [baseMonth, setBaseMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // ---- Who (guests) ----
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });

  const containerRef = useRef(null);
  const navigate = useNavigate();

  const allItems = [...(tours || []), ...(hotels || [])];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveTab(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      const matches = allItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(value.toLowerCase()) ||
          item.location?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const goToItem = (item) => {
    const path = item.category?.toLowerCase().includes('hotel') ? `/tour/${item.id}` : `/tour/${item.id}`;
    navigate(path);
    setActiveTab(null);
  };

  const pickDay = (year, month, day) => {
    if (!day) return;
    const picked = new Date(year, month, day);
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(picked);
      setCheckOut(null);
    } else if (picked < checkIn) {
      setCheckIn(picked);
      setCheckOut(null);
    } else {
      setCheckOut(picked);
    }
  };

  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
  const isInRange = (d) => checkIn && checkOut && d > checkIn && d < checkOut;

  const updateGuest = (key, delta) => {
    setGuests((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const totalGuests = guests.adults + guests.children;
  const whenLabel =
    checkIn && checkOut
      ? `${checkIn.getDate()} ${MONTH_NAMES[checkIn.getMonth()].slice(0, 3)} – ${checkOut.getDate()} ${MONTH_NAMES[checkOut.getMonth()].slice(0, 3)}`
      : checkIn
        ? `${checkIn.getDate()} ${MONTH_NAMES[checkIn.getMonth()].slice(0, 3)} – Add end date`
        : 'Add dates';
  const whoLabel =
    totalGuests > 0
      ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`
      : 'Add guests';

  const renderMonth = (offset) => {
    const d = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const cells = buildMonthGrid(year, month);

    return (
      <div style={{ minWidth: '260px' }}>
        <p style={{ textAlign: 'center', color: 'white', fontWeight: 600, marginBottom: '14px' }}>
          {MONTH_NAMES[month]} {year}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {DAY_LABELS.map((l, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '12px', color: TEXT_MUTED, marginBottom: '4px' }}>
              {l}
            </div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateObj = new Date(year, month, day);
            const selected = isSameDay(dateObj, checkIn) || isSameDay(dateObj, checkOut);
            const inRange = isInRange(dateObj);
            const past = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

            return (
              <button
                key={i}
                type="button"
                disabled={past}
                onClick={() => pickDay(year, month, day)}
                style={{
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: past ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: selected ? 700 : 400,
                  color: past ? '#4b5563' : selected ? '#0b0f17' : inRange ? 'white' : '#e5e7eb',
                  backgroundColor: selected ? ACCENT : inRange ? 'rgba(0,180,216,0.18)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!selected && !past) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!selected && !past) e.currentTarget.style.backgroundColor = inRange ? 'rgba(0,180,216,0.18)' : 'transparent';
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const segmentBaseStyle = (tab) => ({
    flex: 1,
    padding: '10px 26px',
    cursor: 'pointer',
    borderRadius: '999px',
    transition: 'background-color 0.2s',
    backgroundColor: activeTab === tab ? '#1f2937' : 'transparent',
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        margin: '40px auto',
      }}
    >
      {/* PILL BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: BG_DARK,
          border: `1px solid ${BORDER}`,
          borderRadius: '999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
          padding: '8px',
        }}
      >
        {/* WHERE */}
        <div style={segmentBaseStyle('where')} onClick={() => setActiveTab(activeTab === 'where' ? null : 'where')}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', margin: 0 }}>Where</p>
          <input
            className="w-full bg-transparent outline-none"
            style={{ fontSize: '14px', color: TEXT_MUTED, marginTop: '2px' }}
            placeholder="Search destinations"
            value={searchQuery}
            onFocus={() => setActiveTab('where')}
            onChange={handleSearchChange}
          />
        </div>

        <div style={{ width: '1px', height: '32px', backgroundColor: BORDER }} />

        {/* WHEN */}
        <div style={segmentBaseStyle('when')} onClick={() => setActiveTab(activeTab === 'when' ? null : 'when')}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', margin: 0 }}>When</p>
          <p style={{ fontSize: '14px', color: TEXT_MUTED, margin: '2px 0 0' }}>{whenLabel}</p>
        </div>

        <div style={{ width: '1px', height: '32px', backgroundColor: BORDER }} />

        {/* WHO */}
        <div style={segmentBaseStyle('who')} onClick={() => setActiveTab(activeTab === 'who' ? null : 'who')}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', margin: 0 }}>Who</p>
          <p style={{ fontSize: '14px', color: TEXT_MUTED, margin: '2px 0 0' }}>{whoLabel}</p>
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="button"
          onClick={() => setActiveTab(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`,
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0,180,216,0.4)',
          }}
        >
          <Search size={18} />
        </button>
      </div>

      {/* WHERE DROPDOWN */}
      {activeTab === 'where' && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            width: '100%',
            maxWidth: '420px',
            backgroundColor: BG_DARK,
            border: `1px solid ${BORDER}`,
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '16px',
            zIndex: 50,
            maxHeight: '360px',
            overflowY: 'auto',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: TEXT_MUTED, padding: '0 12px 10px' }}>
            {searchQuery ? 'Matching destinations' : 'Suggested destinations'}
          </p>

          {!searchQuery && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', borderRadius: '14px', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0,180,216,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={20} color={ACCENT} />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>Nearby</p>
                <p style={{ color: TEXT_MUTED, fontSize: '13px', margin: 0 }}>Find what's around you</p>
              </div>
            </div>
          )}

          {(searchQuery ? suggestions : allItems.slice(0, 6)).length > 0 ? (
            (searchQuery ? suggestions : allItems.slice(0, 6)).map((item) => (
              <div
                key={item.id}
                onClick={() => goToItem(item)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', borderRadius: '14px', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img src={item.img} alt={item.title} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <p style={{ color: 'white', fontWeight: 600, margin: 0, fontSize: '14px' }}>{item.title}</p>
                  <p style={{ color: TEXT_MUTED, fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {item.location}
                  </p>
                </div>
              </div>
            ))
          ) : (
            searchQuery && <p style={{ color: TEXT_MUTED, padding: '12px' }}>No destinations found.</p>
          )}
        </div>
      )}

      {/* WHEN DROPDOWN */}
      {activeTab === 'when' && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: BG_DARK,
            border: `1px solid ${BORDER}`,
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '24px',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1, 1))}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
            >
              ‹
            </button>
            <div style={{ display: 'flex', gap: '36px' }}>
              {renderMonth(0)}
              {renderMonth(1)}
            </div>
            <button
              type="button"
              onClick={() => setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1))}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
            >
              ›
            </button>
          </div>

          {(checkIn || checkOut) && (
            <button
              type="button"
              onClick={() => {
                setCheckIn(null);
                setCheckOut(null);
              }}
              style={{
                background: 'none',
                border: `1px solid ${BORDER}`,
                color: 'white',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* WHO DROPDOWN */}
      {activeTab === 'who' && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '320px',
            backgroundColor: BG_DARK,
            border: `1px solid ${BORDER}`,
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '10px 20px',
            zIndex: 50,
          }}
        >
          {[
            { key: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
            { key: 'children', label: 'Children', sub: 'Ages 2–12' },
            { key: 'infants', label: 'Infants', sub: 'Under 2' },
            { key: 'pets', label: 'Pets', sub: 'Bringing a service animal?' },
          ].map((row, idx, arr) => (
            <div
              key={row.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 0',
                borderBottom: idx < arr.length - 1 ? `1px solid ${BORDER}` : 'none',
              }}
            >
              <div>
                <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{row.label}</p>
                <p style={{ color: TEXT_MUTED, fontSize: '13px', margin: 0 }}>{row.sub}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={() => updateGuest(row.key, -1)}
                  disabled={guests[row.key] === 0}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: `1px solid ${BORDER}`,
                    background: 'none',
                    color: guests[row.key] === 0 ? '#4b5563' : 'white',
                    cursor: guests[row.key] === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ color: 'white', width: '16px', textAlign: 'center' }}>{guests[row.key]}</span>
                <button
                  type="button"
                  onClick={() => updateGuest(row.key, 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: `1px solid ${BORDER}`,
                    background: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}