function makeid(): string {
  /**
   * Generate random string characters.
   * 
   * Source:
   *    - https://stackoverflow.com/a/1349426
   */
  const length: number = 15;

  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  // Append timestamp numbers for 100% uniqueness
  let timestamp: string = (new Date()).getTime().toString();
  result += timestamp;

  return result;
}

export = makeid;
