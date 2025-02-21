export enum PackageStatus {
  Pending = "Pending",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Expired = "Expired",
  Undelivered = "Undelivered",
  Exception = "Exception",
  Unknown = "Unknown",
}

export const packageStatusMap: Record<number, PackageStatus> = {
  0: PackageStatus.Pending,
  1: PackageStatus.InTransit,
  2: PackageStatus.Expired,
  4: PackageStatus.Delivered,
  5: PackageStatus.Undelivered,
  6: PackageStatus.Unknown,
  7: PackageStatus.Unknown,
  8: PackageStatus.Unknown,
  9: PackageStatus.Unknown,
  10: PackageStatus.Exception,
};

export class Package {
  id?: string;
  destinationCountry: number | string;
  friendlyName?: string;
  infoText?: string;
  location?: string;
  timestamp?: string;
  tz: string;
  originCountry: number | string;
  packageType: number | string;
  status: number | string;
  trackingNumber: string;

  constructor(
    trackingNumber: string,
    options: {
      id?: string;
      destinationCountry: number | string;
      friendlyName?: string;
      infoText?: string;
      location?: string;
      timestamp?: string;
      tz?: string;
      originCountry: number | string;
      packageType: number | string;
      status: number | string;
    }
  ) {
    this.trackingNumber = trackingNumber;
    this.id = options.id;
    this.destinationCountry = options.destinationCountry;
    this.friendlyName = options.friendlyName;
    this.infoText = options.infoText;
    this.location = options.location;
    this.timestamp = options.timestamp;
    this.tz = options.tz || "UTC";
    this.originCountry = options.originCountry;
    this.packageType = options.packageType;
    this.status = options.status;
  }
}
