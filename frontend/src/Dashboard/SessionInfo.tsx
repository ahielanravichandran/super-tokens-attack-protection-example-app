import { getApiDomain } from "../config/domains";

export default function SessionInfo() {
  async function callAPIClicked() {
    const response = await fetch(getApiDomain() + "/sessioninfo");
    const data = await response.json();
    window.alert("Session Information:\n" + JSON.stringify(data, null, 2));
  }

  return (
    <div onClick={callAPIClicked} className="sessionButton">
      Call API
    </div>
  );
}
