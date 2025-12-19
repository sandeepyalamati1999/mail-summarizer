import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import CommonLucideIcon from '../../common/Icons/CommonLucideIcon';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllDetailsQuery } from '../../redux/Apislice';
import { MdEmail } from 'react-icons/md';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { data, isLoading, refetch } = useGetAllDetailsQuery(
    `/menus?filter=${JSON.stringify({ criteria: [] })}&sortField=sequenceNo&direction=desc`
  );
  console.log('MENULIST DATA', data);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen lg:w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-2 py-5.5 lg:py-6.5">
        <NavLink to="/" className={"flex items-center gap-2"}>
          <MdEmail className="size-5"/>
          <h2 className="text-2xl text-white">Email Summarization</h2>
          {/* <img src={Logo} alt="Logo" /> */}
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
          </div>
          <ul className="mt-4 mb-5.5 flex flex-col ms-2">
            <li>
              {data?.menulists?.map(({ name, iconName, route }) => {
                return (
                  <NavLink
                    key={name}
                    to={route}
                    className={({ isActive }) =>
                      'group relative flex items-center gap-5 rounded-md px-4 py-2 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                      (isActive && '!text-white')
                    }
                  >
                    <>
                      <CommonLucideIcon name={iconName} />
                      {name}
                    </>
                  </NavLink>
                );
              })}
            </li>
          </ul>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
