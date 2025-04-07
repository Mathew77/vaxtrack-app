
export const filterNavData = (navData: any[], userRoles: string[]) => {
    return navData
      .filter((item) => {
        // Check if the user's roles intersect with the item's roles
        return item.roles.some((role: string) => userRoles.includes(role));
      })
      .map((item) => {
        // If the item has children, filter them too
        if (item.children) {
          return {
            ...item,
            children: item.children.filter((child: any) =>
              child.roles.some((role: string) => userRoles.includes(role))
            ),
          };
        }
        return item;
      });
  };