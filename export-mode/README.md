# Export Image and Metadata Extension and Mode <br> By Morgan Lee

## Installation and use:
To install and run this version of the OHIF viewer you should follow the steps:

1. Create a fork of the repository
1. Clone the your fork repository onto your local machine
2. Run the commands: <br>
yarn install --frozen-lockfile <br>
yarn run dev
3. The system should then start running

NB: If you do not have yarn installed on your machine it can be done by first installing NPM and then running the command <br> npm install --global yarn

Upon having the system start, you can check that the extension and mode are working as expected by selecting one of the example study sets and selecting 'Export Mode'. This will then take you to a viewer where the only visible toolbar button is a download icon. Upon pressing this, the viewport image and study metadata will be downloaded.


## Write Up

The new additions to the codebase can be found in the new directory titled 'export-mode' wherein 'export' is the code for the new mode and 'export-extension' is the code for the new extension

### Development Process
My development process started by identifying the requirements for the challenge, those being create a new mode, create a new extension, implement downloading the metadata and the image.

The stages for creating the mode and extension did not require breaking up but the implementation stage was separated into the steps of accessing and storing the metadata, downloading the metadata, getting and downloading the viewport image, downloading the metadata and image as a zip.

The creation for the mode and extension was done through following the tutorials provided in the OHIF documentation to begin the development and then reading through existing extensions and modes to finish the development and make the features work as expected.

For the implementation of the zip feature, extracting the metadata was done through reading the documentation, accessing and downloading the viewport image was done through following examples within the Cornerstone Download Form, downloading the data as a zip was done through following online examples of the JSzip library.

### Challenges
The major challenges faced while developing this solution were the use of the new API and system, notably the fact that some of the development did not act the same as how it was described in the documentation.

I overcame these challenges mostly by reading the code for some of the existing extensions within the codebase and following the structure outlined in them. Following this, if the code still did not work then I checked online forums for instances of people encountering similar problems and what methods they used to get the information and needed.

### Future Development
For future development, the main area of focus would be to implement testing for the new features. These would include both automated tests with technologies such as playwright and a more thorough manual testing procedure. This would have been a larger focus during initial development but given the time constraints and the difficulty of learning the new system, I omitted it in favour of focusing on the feature development.