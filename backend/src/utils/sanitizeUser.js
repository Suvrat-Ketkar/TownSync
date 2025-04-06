export function omitPassword(user) {
    const { password, refreshToken, ...rest } = user.toObject();
    return rest;
  }
  