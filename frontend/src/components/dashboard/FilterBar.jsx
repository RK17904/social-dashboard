import React, { useState, useEffect } from 'react';
import { Plus, Calendar, X } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';

//imports for calendar
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

export default function FilterBar({ 
  accounts, setAccounts, 
  selectedCompany, setSelectedCompany, 
  selectedPlatform, setSelectedPlatform,
  dateRange, setDateRange 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyPlatforms, setNewCompanyPlatforms] = useState([]);

  const activeAccount = accounts.find(acc => acc.name === selectedCompany) || accounts[0];

  useEffect(() => {
    if (!activeAccount.platforms.includes(selectedPlatform)) {
      setSelectedPlatform(activeAccount.platforms[0]);
    }
  }, [selectedCompany, activeAccount, selectedPlatform, setSelectedPlatform]);

  const handleAddAccount = () => {
    if (!newCompanyName || newCompanyPlatforms.length === 0) return;
    setAccounts([...accounts, { name: newCompanyName, platforms: newCompanyPlatforms }]);
    setSelectedCompany(newCompanyName); 
    setSelectedPlatform(newCompanyPlatforms[0]); 
    setShowAddModal(false);
    setNewCompanyName('');
    setNewCompanyPlatforms([]);
  };

  const togglePlatform = (platform) => {
    if (newCompanyPlatforms.includes(platform)) {
      setNewCompanyPlatforms(newCompanyPlatforms.filter(p => p !== platform));
    } else {
      setNewCompanyPlatforms([...newCompanyPlatforms, platform]);
    }
  };

  const renderIcon = (platform, size = 24) => {
    switch (platform) {
      case 'Facebook': return <FaFacebook size={size} />;
      case 'Instagram': return <FaInstagram size={size} />;
      case 'LinkedIn': return <FaLinkedin size={size} />;
      case 'TikTok': return <FaTiktok size={size} />;
      case 'YouTube': return <FaYoutube size={size} />;
      default: return null;
    }
  };

  //format dates (Apr 1 - May 8)
  const formattedStartDate = format(dateRange[0].startDate, 'MMM d');
  const formattedEndDate = format(dateRange[0].endDate, 'MMM d');

  return (
    <div className="filter-bar">
      
      {/*add account model*/}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>Add New Account</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Company / Account Name</label>
            <input 
              type="text" 
              className="custom-input" 
              placeholder="e.g., Summit Corp" 
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />

            <label style={{ display: 'block', margin: '15px 0 8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Select Active Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
              {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map(plat => (
                <div 
                  key={plat} 
                  className={`platform-toggle ${newCompanyPlatforms.includes(plat) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(plat)}
                >
                  {renderIcon(plat, 18)} {plat}
                </div>
              ))}
            </div>

            <button className="primary-btn" onClick={handleAddAccount}>
              Save Account
            </button>
          </div>
        </div>
      )}

      {/*account section (left)*/}
      <div className="filter-group">
        <select 
          className="custom-select" 
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {accounts.map((acc, index) => (
            <option key={index} value={acc.name}>{acc.name}</option>
          ))}
        </select>
        <button className="icon-btn" style={{ border: '1px solid var(--border-color)' }} title="Add Account" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
        </button>
      </div>

      {/*social tabs*/}
      <div className="social-tabs">
        {activeAccount.platforms.map(platform => (
          <div 
            key={platform}
            className={`social-tab ${selectedPlatform === platform ? 'active' : ''}`} 
            onClick={() => setSelectedPlatform(platform)}
            title={platform}
          >
            {renderIcon(platform)}
          </div>
        ))}
      </div>

      {/*caledar frop down*/}
      <div className="dropdown-container">
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-color)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', backgroundColor: showCalendar ? 'var(--accent-light)' : 'transparent' }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <Calendar size={18} color="var(--accent-primary)" />
          {/*automatically shows Apr 1 - May 8 dynamically*/}
          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
            {formattedStartDate} - {formattedEndDate}
          </span>
        </div>

        {showCalendar && (
          <div className="calendar-popover" style={{ padding: '0', width: 'auto', overflow: 'hidden' }}>
            <DateRange
              editableDateInputs={true}
              onChange={item => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              rangeColors={['var(--accent-primary)']} /*makes the highlights match purple theme*/
            />
            <div style={{ padding: '10px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <button 
                className="primary-btn" 
                style={{ width: '100%' }}
                onClick={() => setShowCalendar(false)}
              >
                Apply Date Filter
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}