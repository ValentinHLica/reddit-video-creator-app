import React, { useEffect, useRef } from "react";

const uaup = window.require("uaup-js");

const Updater: React.FC = () => {
  const progressEl = useRef<HTMLProgressElement>(null);
  const stateEl = useRef<HTMLHeadingElement>(null);

  //This is Optional
  const defaultStages = {
    Checking: "Checking...", // When Checking For Updates.
    Found: "Update Found!", // If an Update is Found.
    NotFound: "No Update Found.", // If an Update is Not Found.
    Downloading: "Downloading...", // When Downloading Update.
    Unzipping: "Installing...", // When Unzipping the Archive into the Application Directory.
    Cleaning: "Finalizing...", // When Removing Temp Directories and Files (ex: update archive and tmp directory).
    Launch: "Launching...", // When Launching the Application.
  };

  const updateOptions = {
    gitRepo: "reddit-recap", // [Required] Your Repo Name
    gitUsername: "ValentinHLica", // [Required] Your GitHub Username.
    isGitRepoPrivate: false, // {Default is false} [Optional] If the Repo is Private or Public  (Currently not Supported).
    gitRepoToken: "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",

    appName: "reddit-recap", //[Required] The Name of the app archive and the app folder.
    appExecutableName: "reddit-recap.exe", //[Required] The Executable of the Application to be Run after updating.

    progressBar: progressEl.current, // {Default is null} [Optional] If Using Electron with a HTML Progressbar, use that element here, otherwise ignore
    label: stateEl.current, // {Default is null} [Optional] If Using Electron, this will be the area where we put status updates using InnerHTML
    stageTitles: defaultStages, // {Default is defaultStages} [Optional] Sets the Status Title for Each Stage
  };

  useEffect(() => {
    uaup.Update(updateOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <progress max={100} ref={progressEl} value={0}></progress>

      <h1 ref={stateEl} />
    </div>
  );
};

export default Updater;
