import { id } from './id';
import i18n from 'i18next';
import html2canvas from 'html2canvas';
import { DicomMetadataStore } from '@ohif/core';
import { Icons } from '@ohif/ui-next';
import DownloadIcon from '../../Download';

import JSZIP from 'jszip';

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
  preRegistration: ({ servicesManager, commandsManager, configuration = {} }) => {
    Icons.addIcon("DownloadIcon", DownloadIcon);
  },

  /**
   * ToolbarModule should provide a list of tool buttons that will be available in OHIF
   * for Modes to consume and use in the toolbar. Each tool button is defined by
   * {name, defaultComponent, clickHandler }. Examples include radioGroupIcons and
   * splitButton toolButton that the default extension is providing.
   */
  getToolbarModule: ({ servicesManager, commandsManager, extensionManager }) => {
    return [
      {
        // Button for the Export Viewport command
        id: 'ExportViewport',
        uiType: 'ohif.toolButton',
        props: {
          icon: 'DownloadIcon',
          label: i18n.t('Buttons:Export Data'),
          commands: 'exportViewport'
        }
      }
    ]
  },



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
        // Gets the current active viewport and exports it as a zip file containing an image and metadata
        exportViewport: {
          commandFn: async () => {
            console.log('Exporting the viewport');
            
            const { viewportGridService, displaySetService } = servicesManager.services;
            
            // Gets the metadata for the active study
            const displaySets = displaySetService.getActiveDisplaySets();
            const studyInstanceUID = displaySets[0]?.StudyInstanceUID;

            const study = DicomMetadataStore.getStudy(studyInstanceUID)

            const patientName = study.series[0].instances[0].PatientName.toString();
            const studyDate = study.series[0].instances[0].StudyDate;

            const studyData = {PatientName: patientName, StudyDate: studyDate};
            
            // Gets the active viewport element to export
            // Follows logic similar to Screenshot tool
            const activeViewport = viewportGridService.getActiveViewportId();
            
            const divForDownloadViewport = document.querySelector(
              `div[data-viewport-uid="${activeViewport}"]`
            );

            if (!divForDownloadViewport) {
              console.debug('No viewport found for download');
              return;
            }

            const canvas = await html2canvas(divForDownloadViewport as HTMLElement);
            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));

            // Create a zip file containing the image and metadata
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
};
