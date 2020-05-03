<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.gif" alt="Logo">
  </a>

  <h1 align="center">BTE-tools</h1>

  <p align="center">
    Awesome tools and scripts to enhance your experience on the Build The Earth project!
    <br />
    <a href="https://buildtheearth.net/"><strong>Go to Build The Earth »</strong></a>
    <br />
    <br />
    <a href="https://github.com/oganexon/BTE-tools/issues">Report Bug</a>
    ·
    <a href="https://github.com/oganexon/BTE-tools/issues">Request Feature</a>
  </p>
</p>


## Table of Contents

- [Table of Contents](#table-of-contents)
- [✨ About The Project](#%e2%9c%a8-about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [📦 Installation](#%f0%9f%93%a6-installation)
- [🚀 Usage](#%f0%9f%9a%80-usage)
  - [list](#list)
  - [tpll](#tpll)
  - [tpdms](#tpdms)
  - [draw](#draw)
- [🔍 Find a railroad name](#%f0%9f%94%8d-find-a-railroad-name)
- [📜 Roadmap](#%f0%9f%93%9c-roadmap)
- [🏗️ Contributing](#%f0%9f%8f%97%ef%b8%8f-contributing)
- [License](#license)
- [Contact](#contact)



## ✨ About The Project

![Product Name Screen Shot](images/rails.png)

The BTE generation is not perfect and some structures such as railway lines are missing.
Doing it by hand is unthinkable given the curves and the number of measurements that would have to be taken. 
This set of tools will allow you to enjoy a better experience on BTE and build to your full potential.

### Built With

* [Node](https://nodejs.org/)

## Getting Started


### Prerequisites

You must have WorldEdit as a minimum but install the BTE modpack, it's preferable.

## 📦 Installation

1. Download the [Rhino Javacsript interpreter](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) for Java,
which you can get from [here](https://github.com/mozilla/rhino/releases/download/Rhino1_7_12_Release/rhino-1.7.12.zip).
Open the zip file, go to `/lib` and move `rhino-1.7.12.jar` (or newer) to your `mods` Minecraft folder.
(Usually `C:\Users\[USERNAME]\Twitch\Minecraft\Instances\Build The Earth modpack\mods` on Windows)

2. Download the latest version of BTE-scripts [here](https://github.com/oganexon/BTE-tools/releases) and place the `craftscripts` folder in `/config/worldedit`.

3. (Recommended) Change the value of `scripting-timeout` to `30000` or higher in `/config/worldedit`. (`3000` ms by default)



## 🚀 Usage

```bash
/cs <COMMAND> [ARGS]
```

These are WorldEdit scripts, if blocks are modified you have access to `//undo`.

- **list** : Lists all available commands.
- **tpll** : Replaces the tpll command since permissions can be a problem.
- **tpdms** : Same as tpll but takes `degrees minutes seconds` (such as `47°35'6.32"N 6°53'50.06"E` ).
- **draw** : Traces any imported shape of an OpenStreetMap query - railroads, roads, etc.

Do you need another function? Request it [here](https://github.com/oganexon/BTE-tools/issues).

The first execution of a command will take longer than the others because the script has to be compiled.



### list

```bash
/cs list
```
Lists all available commands.



### tpll

```bash
/cs tpll <latitude> <longitude> [altitude]
```
Replaces the tpll command since permissions can be a problem.
This modified version will take you to the highest block even if you've build already.
You don't need to remove the comma if there is one when you copy the coordinates.

Examples :

```bash
/cs tpll 47.58523 6.89725
/cs tpll 47.58523, 6.89725, 370
```



### tpdms

```bash
/cs tpdms <latitude> <longitude> [altitude]
```
Same as tpll but takes `degrees minutes seconds`
This modified version will take you to the highest block even if you've build already.
You don't need to remove the comma if there is one when you copy the coordinates.

Examples :

```bash
/cs tpdms 47°35\'6.32"N 6°53\'50.06"E
/cs tpdms 47°35\'6.32"N, 6°53\'50.06"E, 370
```



### draw

```bash
/cs draw <file> <block> [options]
```
Traces any imported shape of an OpenStreetMap query - railroads, roads, etc.

Options :
 - **u** (up): Draw a block above

Setup :
 - Create a `drawings` folder inside `/config/worldedit`.
 - Get a geoJSON file of valid tracings / OR
 - Choose one of the following links:
   - [Rails - bounding box](http://overpass-turbo.eu/s/TwW) (Select the desired region using the map)
   - [Rails - name](http://overpass-turbo.eu/s/TwY) (Replace with a specific railroad name) [(find a railroad name)](#%f0%9f%94%8d-find-a-railroad-name)
 - Click `Run` > `Export` > `download/copy as GeoJSON`
 - Place the file in the `drawings` folder.

Examples :

```bash
/cs draw rails1 iron_block
/cs draw file3 stone u
```



## 🔍 Find a railroad name

To find a railway name, right click near the rails and click on `Query features`

![](images/rails1.png)

Then, click on the desired rail

![](images/rails2.png)

And finally, get the name.

![](images/rails3.png)



## 📜 Roadmap

See the [open issues](https://github.com/oganexon/BTE-tools/issues) for a list of proposed features (and known issues).



## 🏗️ Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Make sure that `yarn build` and `yarn lint` do not generate errors
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request



## License

Distributed under the MIT License. See `LICENSE` for more information.



## Contact

Oganexon#2001 - Discord
