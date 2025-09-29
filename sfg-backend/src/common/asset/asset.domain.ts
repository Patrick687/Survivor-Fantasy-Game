export class AssetDomain {
  constructor(
    public assetId: string,
    public bucketKey: string,
    public assetType: string,
  ) {}
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}
