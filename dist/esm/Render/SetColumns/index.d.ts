/// <reference types="react" />
interface IProps {
  columns: {
    title: string;
    topFixed?: boolean;
    btmFixed?: boolean;
  }[];
}
export default function SetColoums(props: IProps): JSX.Element;
export {};
