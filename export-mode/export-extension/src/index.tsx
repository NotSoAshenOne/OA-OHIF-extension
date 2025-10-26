import { id } from './id';
import i18n from 'i18next';
import html2canvas from 'html2canvas';
import { DicomMetadataStore, utils, viewports } from '@ohif/core';

import JSZIP from 'jszip';

// import exportViewport from './ZipDownloadButton';

/**
 * You can remove any of the following modules if you don't need them.
 */
export default {
  /**
   * Only required property. Should be a unique value across all extensions.
   * You ID can be anything you want, but it should be unique.
   */
  id,

  /**
   * Perform any pre-registration tasks here. This is called before the extension
   * is registered. Usually we run tasks such as: configuring the libraries
   * (e.g. cornerstone, cornerstoneTools, ...) or registering any services that
   * this extension is providing.
   */
  preRegistration: ({ servicesManager, commandsManager, configuration = {} }) => {},
  /**
   * PanelModule should provide a list of panels that will be available in OHIF
   * for Modes to consume and render. Each panel is defined by a {name,
   * iconName, iconLabel, label, component} object. Example of a panel module
   * is the StudyBrowserPanel that is provided by the default extension in OHIF.
   */
  getPanelModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * ViewportModule should provide a list of viewports that will be available in OHIF
   * for Modes to consume and use in the viewports. Each viewport is defined by
   * {name, component} object. Example of a viewport module is the CornerstoneViewport
   * that is provided by the Cornerstone extension in OHIF.
   */
  getViewportModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * ToolbarModule should provide a list of tool buttons that will be available in OHIF
   * for Modes to consume and use in the toolbar. Each tool button is defined by
   * {name, defaultComponent, clickHandler }. Examples include radioGroupIcons and
   * splitButton toolButton that the default extension is providing.
   */
  getToolbarModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return [
      {
        id: 'ExportViewport',
        uiType: 'ohif.toolButton',
        props: {
          icon: 'tool-capture',
          label: i18n.t('Buttons:Export'),
          tooltip: i18n.t('Buttons: Export Image'),
          commands: 'exportViewport'
        }
      }
    ]
  },
  /**
   * LayoutTemplateMOdule should provide a list of layout templates that will be
   * available in OHIF for Modes to consume and use to layout the viewer.
   * Each layout template is defined by a { name, id, component}. Examples include
   * the default layout template provided by the default extension which renders
   * a Header, left and right sidebars, and a viewport section in the middle
   * of the viewer.
   */
  getLayoutTemplateModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * SopClassHandlerModule should provide a list of sop class handlers that will be
   * available in OHIF for Modes to consume and use to create displaySets from Series.
   * Each sop class handler is defined by a { name, sopClassUids, getDisplaySetsFromSeries}.
   * Examples include the default sop class handler provided by the default extension
   */
  getSopClassHandlerModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * HangingProtocolModule should provide a list of hanging protocols that will be
   * available in OHIF for Modes to use to decide on the structure of the viewports
   * and also the series that hung in the viewports. Each hanging protocol is defined by
   * { name, protocols}. Examples include the default hanging protocol provided by
   * the default extension that shows 2x2 viewports.
   */
  getHangingProtocolModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * CommandsModule should provide a list of commands that will be available in OHIF
   * for Modes to consume and use in the viewports. Each command is defined by
   * an object of { actions, definitions, defaultContext } where actions is an
   * object of functions, definitions is an object of available commands, their
   * options, and defaultContext is the default context for the command to run against.
   */
  getCommandsModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return {
      definitions: {
        exportViewport: {
          commandFn: async () => {
            console.log('Exporting the viewport');
            
            const { viewportGridService, displaySetService } = servicesManager.services;
          
            const displaySets = displaySetService.getActiveDisplaySets();
            const studyInstanceUID = displaySets[0]?.StudyInstanceUID;

            const study = DicomMetadataStore.getStudy(studyInstanceUID)

            console.log('Study:', study);
            console.log('study instance:', study.series[0].instances[0]);
            console.log('Display Sets:', displaySets);

            const patientName = study.series[0].instances[0].PatientName.toString();
            const studyDate = study.series[0].instances[0].StudyDate;

            const studyData = {PatientName: patientName, StudyDate: studyDate};
            console.log('Study Data:', studyData);
            
            const activeViewport = viewportGridService.getActiveViewportId();
            
            // Code from the cornerstone download form extension to get viewport image
            const divForDownloadViewport = document.querySelector(
              `div[data-viewport-uid="${activeViewport}"]`
            );

            if (!divForDownloadViewport) {
              console.debug('No viewport found for download');
              return;
            }

            const canvas = await html2canvas(divForDownloadViewport as HTMLElement);
            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));

            const zip = new JSZIP();
            zip.file('image.jpg', imageBlob);
            zip.file('metadata.json', JSON.stringify(studyData, null, 2));
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            const link = document.createElement('a');
            link.download = `report.zip`;
            link.href = URL.createObjectURL(zipBlob);
            link.click();

          }, 
          storeContexts: []
        },
      },
      defaultContext: ['ACTIVE_VIEWPORT::CORNERSTONE'],
    }
  },
  /**
   * ContextModule should provide a list of context that will be available in OHIF
   * and will be provided to the Modes. A context is a state that is shared OHIF.
   * Context is defined by an object of { name, context, provider }. Examples include
   * the measurementTracking context provided by the measurementTracking extension.
   */
  getContextModule: ({ servicesManager, commandsManager, extensionManager }) => {},
  /**
   * DataSourceModule should provide a list of data sources to be used in OHIF.
   * DataSources can be used to map the external data formats to the OHIF's
   * native format. DataSources are defined by an object of { name, type, createDataSource }.
   */
  getDataSourcesModule: ({ servicesManager, commandsManager, extensionManager }) => {},
};
