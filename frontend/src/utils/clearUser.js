export const getCleanUserId = () =>
    localStorage.getItem("userId")?.replace(/^"+|"+$/g, '');
  