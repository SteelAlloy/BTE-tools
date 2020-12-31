# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security -->

## [2.3.0] - 2020-12-31

### Added

- `/cs goto` command, to TP the player to a precise place.

## [2.2.0] - 2020-12-01

### Added

- `/cs gis_no` command, to get better elevation data for Norway.

## [2.1.0] - 2020-10-26

### Added

- `restrict`option in every osm related command.
  - Will restrict the command to the selected region.

### Security 

- **BTE-tools is no longer maintained.**

## [2.0.0] - 2020-08-10

### Added

- `/cs osm` and `/cs osmnear` to run any overpass query in an area and plot the path
- `/cs gis_jp` command, to get better elevation data in Japan.

- `/cs draw` command:
  - Keyhole markup language (.kml) support.
- `/cs rails` command:
  - `regex` option (allow you to select rail type)

- Every command that places blocks:
  - `height` option to set wall height.
  - `onGround` option to draw on the ground or not.
  - `offset` option to set ground offset.
  - `ignoreBuildings` option to ignore existing buildings.
  - `ignoreVegetation` option to ignore vegetation.
  - `ignoredBlocks` & `allowedBlocks` options.

### Changed

- `/cs ign` is now `/cs gis_fr`
- The syntax of all commands has been changed. Options are now in the form of a JSON object, offering much more flexibility.
- `/cs rails <mode>` command and `/cs hedges <mode>` have been split into different commands: `rails`, `railsnear`, `hedges`, `hedgesnear`.

### Removed

- `list` command. Use `/cs help` instead.

### Fixed

- OSM commands for the western hemisphere.
- Corrupted values in elevation commands.
- `undefined` values in some commands

### Security 

- Updated Node modules.

## [1.4.0] - 2020-05-24

### Added

- `hedges` command: traces hedges around farmland

### Changed

- `rails` syntax
  - now takes block option.

## [1.3.1] - 2020-05-20

### Added

- `ign` command
  - Smoothing step.

### Changed

- `ign` command
  - Support for regions of all shapes.
  - Faster calculations (request parallelization).


## [1.3.0] - 2020-05-13

### Added

- `ign` command.

### Changed

- `tpdms` and `tpll` are now unified.

### Removed

- `tpdms` command.


## [1.2.0] - 2020-05-07

### Added

- `address` command.
  

## [1.1.1] - 2020-05-06

### Fixed

- `rails` command now scan for all rails instead of a small subset.


## [1.1.0] - 2020-05-05

### Added

- `rails` command.
