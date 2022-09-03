/*
 * @Date: 2022-05-19 18:33:00
 * @LastEditors: 追随
 * @LastEditTime: 2022-05-19 18:54:53
 */
export default ({ headerContent, children, footerContent }: any) => {
  return (
    <div>
      {headerContent}
      {children}
      {footerContent}
    </div>
  );
};
