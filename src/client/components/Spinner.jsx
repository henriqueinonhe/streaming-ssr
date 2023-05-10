import { Base } from "./Base";

export const Spinner = ({ label }) => {
  return (
    <Base border={"3px dashed #BBB"} label={label}>
      Loading
    </Base>
  );
};
