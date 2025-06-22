export class MemberNotFoundError extends Error {
  constructor(memberId: string) {
    super(`Member with ID ${memberId} not found.`);
    this.name = 'MemberNotFoundError';
  }
}
