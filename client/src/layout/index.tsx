import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <div>
        <Link to="/aaa">aaa</Link>
      </div>
      <div>
        <Link to="/bbb">bbb</Link>
      </div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
