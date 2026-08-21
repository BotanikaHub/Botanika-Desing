import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { BotanikaReel, botanikaReelSchema } from "./Botanika/BotanikaReel";
import { BRAND, REEL } from "./Botanika/constants";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Botanika — vertical Reel/TikTok promo (9:16).
          Render: npx remotion render BotanikaReel */}
      <Composition
        id="BotanikaReel"
        component={BotanikaReel}
        durationInFrames={REEL.durationInFrames}
        fps={REEL.fps}
        width={REEL.width}
        height={REEL.height}
        schema={botanikaReelSchema}
        defaultProps={{
          brandName: "Botanika",
          tagline: "Beleza que vem da natureza",
          url: "botanikabrasil.com.br",
          green: BRAND.green,
          indigo: BRAND.indigo,
        }}
      />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
