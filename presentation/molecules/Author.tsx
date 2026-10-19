import { Avatar } from "../atoms/Avatar";

type AuthorProps = {
  name: string;
  avatarUrl: string;
  size: number;
  nameClassName: string;
};

export function Author({ name, avatarUrl, size, nameClassName }: AuthorProps) {
  return (
    <>
      <Avatar avatarUrl={avatarUrl} name={name} size={size} />
      <p className={nameClassName}>{name}</p>
    </>
  );
}
