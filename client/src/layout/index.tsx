import { Outlet, useNavigate } from "react-router-dom";
import useDark from "@/hooks/useDark";
import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useCallback, useState } from "react";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

function useMenuItem() {
  const mainItems = [
    {
      key: "room",
      label: "会议室管理",
      icon: <AppstoreOutlined />,
    },
    {
      key: "reserve",
      label: "预定管理",
      icon: <MailOutlined />,
    },
    {
      key: "user_manage",
      label: "用户管理",
      icon: <UserOutlined />,
    },
    {
      key: "key4",
      label: "统计",
      icon: <SettingOutlined />,
    },
  ];

  const settingItems = [
    {
      key: "password",
      label: "修改密码",
      icon: <SettingOutlined />,
    },
    {
      key: "message",
      label: "信息修改",
      icon: <SettingOutlined />,
    },
  ];

  const [item, setItem] = useState<ItemType<MenuItemType>[]>(mainItems);

  function toggleMenu(isSetting: boolean) {
    setItem(() => (isSetting ? settingItems : mainItems));
  }
  return { item, toggleMenu };
}

function Layout() {
  const navigate = useNavigate();
  const { dark, toggle } = useDark();

  const onClick: MenuProps["onClick"] = (e) => {
    const { key } = e;
    navigate(key);
  };

  const { item, toggleMenu } = useMenuItem();

  const handleUser = useCallback(() => {
    navigate("password");
    toggleMenu(true);
  }, []);

  const handleHome = useCallback(() => {
    navigate("/");
    toggleMenu(false);
  }, []);
  return (
    <div className="h-full dark:bg-slate-800">
      <header className="mx-auto max-w-8xl backdrop-blur">
        <div className="flex items-center justify-between py-4 mx-4 border-b border-slate-900/10 lg:px-8 dark:border-slate-300/10 lg:mx-0">
          <div onClick={handleHome} className="text-xl cursor-pointer dark:text-white">
            会议室管理系统
          </div>
          <section className="flex items-center space-x-2 cursor-pointer">
            <span
              onClick={toggle}
              className={dark ? "icon-[twemoji--sun]" : " icon-[line-md--moon-alt-loop]"}
            ></span>
            <span
              onClick={handleUser}
              className="icon-[mdi--user] text-2xl dark:text-white cursor-pointer"
            ></span>
          </section>
        </div>
      </header>
      <div className="h-[calc(100%-61px)]  flex">
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={["user_manage", "password"]}
          defaultOpenKeys={["user_manage", "password"]}
          mode="inline"
          items={item}
        />

        <div className="flex-1 p-2 overflow-auto">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Layout;
