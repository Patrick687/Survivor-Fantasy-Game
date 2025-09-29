export class SeasonDomain {
  constructor(
    public seasonId: number,
    public filmingLocation: string | null,
    public airStartDate: Date | null,
    public airEndDate: Date | null,
  ) {}
}
