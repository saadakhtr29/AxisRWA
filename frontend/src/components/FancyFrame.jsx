import "../styles/FancyFrame.css";
import homeAsset from "../assets/AxisRWA-homeAsset.gif";

export default function FancyFrame() {
  return (
    <div className="dashboard-main-row">
      <div className="dashboard-ops-center">
        <h1>Some Heading</h1>
        <p>Invest in tokenized real-world assets on Ethereum. Lorem ipsum dolor sit amet consectetur. Tristique quis dis dolor dignissim. Neque ut porttitor ut aliquet. Sapien tempor lectus consequat curabitur. Commodo malesuada cras eu justo felis porttitor lorem aenean enim.</p>
      </div>
      <div className="dashboard-orb-center">
        <img className="home-asset-gif" src={homeAsset} alt="homeAsset" />
      </div>
      <div className="dashboard-talktrack">
      <h1>Real-World Assets</h1>
      <p>Invest in tokenized real-world assets on Ethereum. Lorem ipsum dolor sit amet consectetur. Tristique quis dis dolor dignissim. Neque ut porttitor ut aliquet. Sapien tempor lectus consequat curabitur. Commodo malesuada cras eu justo felis porttitor lorem aenean enim.  Neque ut porttitor ut aliquet. Sapien tempor lectus consequat curabitur. Commodo malesuada cras eu justo felis porttitor lorem aenean enim.</p>
      </div>
    </div>
  );
}
