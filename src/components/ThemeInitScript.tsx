// hydration前に実行し、初回描画時点でダークモードのチラつき(FOUC)が出ないようにする
const THEME_INIT_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem("dark") === "true") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
