import React, { useState } from 'react' 
import { 
  BiBookAlt, 
  BiHome, 
  BiSolidUserDetail, 
  BiLogOut, 
  BiSolidSpreadsheet,
  BiCog, 
  BiChevronLeft,
  BiChevronRight,
  BiGasPump,
  BiLineChart,
  BiHelpCircle
} from 'react-icons/bi';
import '../css/Sidebar.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('/dashboard');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (path) => {
    setActiveItem(path);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <BiBookAlt size={24} />
        {!collapsed && <span>Fuel Management</span>}
        <button className="collapse-btn" onClick={toggleSidebar}>
          {collapsed ? <BiChevronRight /> : <BiChevronLeft />}
        </button>
      </div>
      
      <div className="menu-section">
        <div className="menu-title">{!collapsed && "Navigation"}</div>
        <a 
          href='/dasboard' 
          className={activeItem === '/dashboard' ? 'active' : ''}
          onClick={() => handleNavigation('/dashboard')}
        >
          <BiHome /> 
          {!collapsed && <span>Dashboard</span>}
        </a>
        
        <a 
          href='/stockmanagement' 
          className={activeItem === '/stockmanagement' ? 'active' : ''}
          onClick={() => handleNavigation('/stockmanagement')}
        >
          <BiGasPump /> 
          {!collapsed && <span>Fuel Stocks</span>}
        </a>
      </div>
      
      <div className="menu-section">
        <div className="menu-title">{!collapsed && "Management"}</div>
        <a 
          href="http://localhost:3001/employ"
          className={activeItem === 'http://localhost:3001/employ' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault(); // prevent default anchor behavior
            window.location.href = 'http://localhost:3001/employ'; // navigate manually
          }}
        >
          <BiSolidUserDetail />
          {!collapsed && <span>Employees</span>}
        </a>
        
        <a 
          href='/displaysupplier' 
          className={activeItem === '/displaysupplier' ? 'active' : ''}
          onClick={() => handleNavigation('/displaysupplier')}
        >
          <BiSolidSpreadsheet /> 
          {!collapsed && <span>Suppliers</span>}
        </a>
        
        <a 
          href='http://localhost:3002/financials' 
          className={activeItem === 'http://localhost:3002/financials' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault(); // prevent default anchor behavior
            window.location.href = 'http://localhost:3002/financials'; // navigate manually
          }}
        >
          <BiLineChart /> 
          {!collapsed && <span>Financials</span>}
        </a>
        
        <a 
          href='/orders' 
          className={activeItem === '/orders' ? 'active' : ''}
          onClick={() => handleNavigation('/orders')}
        >
          <BiSolidSpreadsheet /> 
          {!collapsed && <span>Orders</span>}
        </a>
      </div>
      
      <div className="menu-section">
        <div className="menu-title">{!collapsed && "Other"}</div>
        <a 
          href='/settings' 
          className={activeItem === '/settings' ? 'active' : ''}
          onClick={() => handleNavigation('/settings')}
        >
          <BiCog /> 
          {!collapsed && <span>Settings</span>}
        </a>
        
        <a 
          href='/help' 
          className={activeItem === '/help' ? 'active' : ''}
          onClick={() => handleNavigation('/help')}
        >
          <BiHelpCircle /> 
          {!collapsed && <span>Help & Support</span>}
        </a>
      </div>
      
      <div className="user-profile">
        {!collapsed && (
          <div className="user-info">
            <p className="user-name">kalana</p>
            <p className="user-role">Administrator</p>
          </div>
        )}
      </div>
      
      <div className="logout">
        <BiLogOut />
        {!collapsed && <span>Logout</span>}
      </div>
    </div>      
  )
}

export default Sidebar