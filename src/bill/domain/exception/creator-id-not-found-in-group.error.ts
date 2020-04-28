export class CreatorIdNotFoundInGroup extends Error {
  public static withString(creatorId: string): CreatorIdNotFoundInGroup {
    return new CreatorIdNotFoundInGroup(
      `Creator Id ${creatorId} not in group.`,
    );
  }
}
