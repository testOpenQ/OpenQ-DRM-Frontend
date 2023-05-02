export abstract class Evaluation<TTarget> {
  constructor(protected target: TTarget, protected accessToken: string) {}

  abstract evaluate(params: any): Promise<any>;
}
