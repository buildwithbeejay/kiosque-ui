export const NGN_PER_USD = 1500;
export const fmtNGN = (ngn: number) => '₦' + ngn.toLocaleString('en-NG');
export const fmtUSD = (ngn: number) => '$' + Math.round(ngn / NGN_PER_USD).toLocaleString('en-US');
