export abstract class Evaluator<TTarget> {
  constructor(protected target: TTarget, protected accessToken: string) {}

  abstract evaluate(
    params: Record<string, string | number | boolean>
  ): Promise<number>;
}
