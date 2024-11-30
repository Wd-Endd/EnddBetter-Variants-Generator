// const statusText = document.getElementById('status');
// statusText.textContent = "This is text write by JavaScript!";

//---
// Base Function
//---

function clickSound() { new Audio("./snd/release-7c974.ogg").play(); }
function elementID(id) { return document.getElementById(id); }
function getRadioValue(name) { return document.querySelector(`input[name=${name}]:checked`).value; }
function generateRandomName(length) { // By Asaki Yuki ;P
    return Array.from({ length }, v => Math.floor(Math.random() * 16).toString(16)).join('');
}
function GenerateUUID() { // By Asaki Yuki
    return "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll(/\$/g, () => Math.floor(Math.random() * 16).toString(16));
}

//---
// Icon
//---

let packIcon;

fetch("./pack_icon.png")
  .then(response => response.blob())
  .then(blob => { packIcon = blob })
  .catch(error => { console.error(error) });

//---
// Manifest
//---

let description = [];

let manifest = {
  format_version: 2,
  header: {
    name: "Endd Better: Variant",
    description: ";-;",
    uuid: "********-****-****-****-************",
    version: [0, 0, 1],
    min_engine_version: [1, 13, 0],
  },
  modules: [
    {
      type: "resources",
      description: ";-;-;-;",
      uuid: "********-****-****-****-************",
      version: [0, 0, 1],
    }
  ]
};

//---
// Variables
//---

let defaultVariables = {};
const variables = {}

function updateSettings() {
  variables['$container_button_type'] = getRadioValue('containerButtonsTyps');
  variables['$force_one_line_hover_text'] = elementID('on_line_hovertext_toggle').checked;

  variables['$force_show_hud'] = elementID('aways_show_hud').checked;
  variables['$disable_enchanted_text_hud'] = elementID('no_enchanted_text').checked;

  variables['$loading_bg'] = elementID('loading_bg_toggle').checked;
  variables['$force_use_loading_bar'] = elementID('loading_bar_toggle').checked;
}

//---
// Generate
//---

elementID('pack_generate').addEventListener("click", function() {
  updateSettings();
  let fullVariables = { ...variables };
  Object.keys(variables).forEach(key => {
    if(defaultVariables[key] === variables[key]) {
      delete variables[key];
    }
  })
  console.log(variables);
  let built = generateRandomName(8);
  description = [
    `built: ${built}`,
    "Config:",
    JSON.stringify(fullVariables, null, 2),
  ];
  manifest.header.description = description.join("\n");
  manifest.header.uuid = GenerateUUID();
  manifest.modules.forEach(module => {
    module.uuid = GenerateUUID();
  });
  console.log(manifest);

  const pack = new JSZip();
  pack.file("manifest.json", JSON.stringify(manifest, null, 0));
  pack.file("ui/_global_variables.json", JSON.stringify(variables, null, 0));
  pack.file("pack_icon.png", packIcon);

  // Download
  pack.generateAsync({ type: "blob" }).then(function(content) {
    const link = document.createElement('a');
    const blob = new Blob([content], { type: "application/octet-stream" });
    link.href = URL.createObjectURL(blob);
    link.download = `endd-better-variant-${built}.mcpack`;
    link.click();
  });
});

//---
// Default Web
//---

window.onload = function() {
  const buttons = document.querySelectorAll("button.minecraft, .option-toggle input[type='checkbox'], .option-radio form div input");
  buttons.forEach(button => {
    if (button.type === "radio" || button.type === "checkbox") {
      button.addEventListener("change", clickSound);
    } else {
      button.addEventListener("click", clickSound);
    }
  });

  updateSettings();
  defaultVariables = { ...variables };
  Object.freeze(defaultVariables);
  console.log(defaultVariables);
}
