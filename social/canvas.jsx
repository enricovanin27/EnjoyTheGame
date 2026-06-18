/* canvas.jsx — assembles the social & merch kit onto the design canvas. */

const F = 600;       // feed square
const SW = 600, SH = 1067;  // story 9:16

function Kit() {
  return (
    <DesignCanvas>
      <DCSection id="feed" title="Post feed · 1:1" subtitle="Set essenziale che segue la scaletta — ogni post fa una cosa sola, chiara.">
        <DCArtboard id="savedate" label="Save the date" width={F} height={F}><PostSaveDate /></DCArtboard>
        <DCArtboard id="iscrizioni" label="Iscrizioni · linee guida" width={F} height={F}><PostIscrizioni /></DCArtboard>
        <DCArtboard id="giorno1" label="Giorno 1" width={F} height={F}><PostGiorno1 /></DCArtboard>
        <DCArtboard id="giorno2" label="Giorno 2" width={F} height={F}><PostGiorno2 /></DCArtboard>
        <DCArtboard id="countdown" label="Countdown (template)" width={F} height={F}><PostCountdown /></DCArtboard>
        <DCArtboard id="maglia" label="Reveal maglia" width={F} height={F}><PostMaglia /></DCArtboard>
      </DCSection>

      <DCSection id="stories" title="Storie · 9:16" subtitle="Più sciolte e ironiche: sondaggi, countdown, meme da campetto. Da buttare lì ogni tanto.">
        <DCArtboard id="sondaggio" label="Sondaggio" width={SW} height={SH}><StorySondaggio /></DCArtboard>
        <DCArtboard id="st-countdown" label="Countdown" width={SW} height={SH}><StoryCountdown /></DCArtboard>
        <DCArtboard id="pov" label="POV meme" width={SW} height={SH}><StoryPov /></DCArtboard>
        <DCArtboard id="tag" label="Tagga la squadra" width={SW} height={SH}><StoryTag /></DCArtboard>
      </DCSection>

      <DCSection id="tees" title="Magliette · 3 direzioni" subtitle="Stesso brand, tre mode diverse. Una proposta per colore — fronte e retro.">
        <DCArtboard id="tee-bold" label="A · Back hit (nero)" width={1180} height={880}><TeeBold /></DCArtboard>
        <DCArtboard id="tee-type" label="B · Tipografica (panna)" width={1180} height={880}><TeeType /></DCArtboard>
        <DCArtboard id="tee-jersey" label="C · Jersey y2k (petrolio)" width={1180} height={880}><TeeJersey /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Kit />);
