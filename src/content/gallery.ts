/**
 * PHOTO GALLERY — built from the old site's mirror.
 *
 * Albums come from three sources, in order: the old site's gallery folders,
 * then subject keywords in the filenames (solo, wave, snow, winch…), then the
 * date encoded in the filename. That beats the old site's single undifferentiated
 * dump — "Club Photographs, 574 items" told a member nothing.
 *
 * Photo titles are derived from filenames with the date prefix stripped and
 * camelCase split, so "180825ShowerToSouth.jpg" reads "Shower To South".
 *
 * `src` goes through LEGACY_BASE like every other imported asset.
 */

export type Photo = { src: string; name: string; bytes: number };
export type Album = { slug: string; title: string; span: string; photos: Photo[] };

export const albums: Album[] = [
 {
  "slug": "camphill-assorted",
  "title": "Camphill — assorted",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/2014MarA.jpg",
    "name": "2014Mar A",
    "bytes": 54737
   },
   {
    "src": "/legacy/members/photos/2014MarB.jpg",
    "name": "2014Mar B",
    "bytes": 53059
   },
   {
    "src": "/legacy/members/photos/606PG160325.1.jpg",
    "name": "606PG160325.1",
    "bytes": 84245
   },
   {
    "src": "/legacy/members/photos/606PG160325.2.jpg",
    "name": "606PG160325.2",
    "bytes": 100584
   },
   {
    "src": "/legacy/members/photos/80thDaveSalmon.jpg",
    "name": "80th Dave Salmon",
    "bytes": 117647
   },
   {
    "src": "/legacy/members/photos/80thNevWilson.jpg",
    "name": "80th Nev Wilson",
    "bytes": 120032
   },
   {
    "src": "/legacy/members/photos/A%20Firework500W.jpg",
    "name": "A Firework500W",
    "bytes": 55739
   },
   {
    "src": "/legacy/members/photos/ACWkshp170212.jpg",
    "name": "ACWkshp170212",
    "bytes": 115692
   },
   {
    "src": "/legacy/members/photos/AJ_LastDaySeason2016.jpg",
    "name": "AJ Last Day Season2016",
    "bytes": 137239
   },
   {
    "src": "/legacy/members/photos/Abney%20Clough%20200222.jpg",
    "name": "Abney Clough 200222",
    "bytes": 78127
   },
   {
    "src": "/legacy/members/photos/AcWrkShopIntr.jpg",
    "name": "Ac Wrk Shop Intr",
    "bytes": 91318
   },
   {
    "src": "/legacy/members/photos/Adrian%20at%20Dresden.jpg",
    "name": "Adrian at Dresden",
    "bytes": 45444
   },
   {
    "src": "/legacy/members/photos/AirShotA171124.JPG",
    "name": "Air Shot A171124",
    "bytes": 22788
   },
   {
    "src": "/legacy/members/photos/AirShotB171124.JPG",
    "name": "Air Shot B171124",
    "bytes": 34230
   },
   {
    "src": "/legacy/members/photos/AirShotsJT1.jpg",
    "name": "Air Shots JT1",
    "bytes": 83932
   },
   {
    "src": "/legacy/members/photos/AirShotsJT2.jpg",
    "name": "Air Shots JT2",
    "bytes": 62356
   },
   {
    "src": "/legacy/members/photos/Airpilots%20Aug2019A.jpg",
    "name": "Airpilots Aug2019A",
    "bytes": 48306
   },
   {
    "src": "/legacy/members/photos/Airpilots%20Aug2019B.jpg",
    "name": "Airpilots Aug2019B",
    "bytes": 39221
   },
   {
    "src": "/legacy/members/photos/Airshot180323.jpg",
    "name": "Airshot180323",
    "bytes": 77778
   },
   {
    "src": "/legacy/members/photos/AlexCGDField.jpg",
    "name": "Alex CGDField",
    "bytes": 112820
   },
   {
    "src": "/legacy/members/photos/AlexGreen_KB18_Attempt.jpg",
    "name": "Alex Green KB18 Attempt",
    "bytes": 48197
   },
   {
    "src": "/legacy/members/photos/AlexOldhamSilverXC.jpg",
    "name": "Alex Oldham Silver XC",
    "bytes": 84013
   },
   {
    "src": "/legacy/members/photos/AndrewNeofytou.jpg",
    "name": "Andrew Neofytou",
    "bytes": 45225
   },
   {
    "src": "/legacy/members/photos/AndyLomas-BI.jpg",
    "name": "Andy Lomas-BI",
    "bytes": 96448
   },
   {
    "src": "/legacy/members/photos/B%26WBBarGrp.jpg",
    "name": "B&WBBar Grp",
    "bytes": 66722
   },
   {
    "src": "/legacy/members/photos/B%26WDiners.jpg",
    "name": "B&WDiners",
    "bytes": 65350
   },
   {
    "src": "/legacy/members/photos/BPCupDiners.jpg",
    "name": "BPCup Diners",
    "bytes": 59487
   },
   {
    "src": "/legacy/members/photos/BeckysFlight.jpg",
    "name": "Beckys Flight",
    "bytes": 134991
   },
   {
    "src": "/legacy/members/photos/BgBbSnSet1.jpg",
    "name": "Bg Bb Sn Set1",
    "bytes": 49314
   },
   {
    "src": "/legacy/members/photos/BgBbSnSet2.jpg",
    "name": "Bg Bb Sn Set2",
    "bytes": 80904
   },
   {
    "src": "/legacy/members/photos/BlackMnts.jpg",
    "name": "Black Mnts",
    "bytes": 45888
   },
   {
    "src": "/legacy/members/photos/BnFr%26Fwks2015_1.jpg",
    "name": "Bn Fr&Fwks2015 1",
    "bytes": 97349
   },
   {
    "src": "/legacy/members/photos/BnFr%26Fwks2015_2.jpg",
    "name": "Bn Fr&Fwks2015 2",
    "bytes": 33295
   },
   {
    "src": "/legacy/members/photos/BngLhch%20BA%20.jpg",
    "name": "Bng Lhch BA",
    "bytes": 178614
   },
   {
    "src": "/legacy/members/photos/BngLhch%20WH.jpg",
    "name": "Bng Lhch WH",
    "bytes": 193258
   },
   {
    "src": "/legacy/members/photos/BngLnch%20JM.jpg",
    "name": "Bng Lnch JM",
    "bytes": 146335
   },
   {
    "src": "/legacy/members/photos/BngLnch%20MA%20.jpg",
    "name": "Bng Lnch MA",
    "bytes": 187825
   },
   {
    "src": "/legacy/members/photos/Bngy%20LnchPnt.jpg",
    "name": "Bngy Lnch Pnt",
    "bytes": 146092
   },
   {
    "src": "/legacy/members/photos/Bob%20Green%20in%20HDC.jpg",
    "name": "Bob Green in HDC",
    "bytes": 40026
   },
   {
    "src": "/legacy/members/photos/BrettonClough151121.jpg",
    "name": "Bretton Clough151121",
    "bytes": 46089
   },
   {
    "src": "/legacy/members/photos/Brian%20Whalley%20swallow2.jpg",
    "name": "Brian Whalley swallow2",
    "bytes": 183819
   },
   {
    "src": "/legacy/members/photos/BrianAllen.jpg",
    "name": "Brian Allen",
    "bytes": 55461
   },
   {
    "src": "/legacy/members/photos/BuxtonRF.jpg",
    "name": "Buxton RF",
    "bytes": 114983
   },
   {
    "src": "/legacy/members/photos/CHillFrmE090120.jpg",
    "name": "CHill Frm E090120",
    "bytes": 12113
   },
   {
    "src": "/legacy/members/photos/CIMG1107.JPG",
    "name": "CIMG1107",
    "bytes": 89012
   },
   {
    "src": "/legacy/members/photos/CIMG1108.JPG",
    "name": "CIMG1108",
    "bytes": 104107
   },
   {
    "src": "/legacy/members/photos/CIMG1117.JPG",
    "name": "CIMG1117",
    "bytes": 102859
   },
   {
    "src": "/legacy/members/photos/CIMG1138.JPG",
    "name": "CIMG1138",
    "bytes": 94661
   },
   {
    "src": "/legacy/members/photos/CIMG1181.JPG",
    "name": "CIMG1181",
    "bytes": 74794
   },
   {
    "src": "/legacy/members/photos/CIMG1184.JPG",
    "name": "CIMG1184",
    "bytes": 31898
   },
   {
    "src": "/legacy/members/photos/CIMG1186.JPG",
    "name": "CIMG1186",
    "bytes": 33401
   },
   {
    "src": "/legacy/members/photos/CIMG5921.jpg",
    "name": "CIMG5921",
    "bytes": 109537
   },
   {
    "src": "/legacy/members/photos/CIMG5922.jpg",
    "name": "CIMG5922",
    "bytes": 72781
   },
   {
    "src": "/legacy/members/photos/CKnappField.jpg",
    "name": "CKnapp Field",
    "bytes": 90458
   },
   {
    "src": "/legacy/members/photos/CPHFlagRbbns.jpg",
    "name": "CPHFlag Rbbns",
    "bytes": 461451
   },
   {
    "src": "/legacy/members/photos/CambridgeGC.jpg",
    "name": "Cambridge GC",
    "bytes": 64762
   },
   {
    "src": "/legacy/members/photos/CampLn170926.jpg",
    "name": "Camp Ln170926",
    "bytes": 55902
   },
   {
    "src": "/legacy/members/photos/Camphill%20Harefield.jpg",
    "name": "Camphill Harefield",
    "bytes": 90199
   },
   {
    "src": "/legacy/members/photos/Camphill.jpg",
    "name": "Camphill",
    "bytes": 42782
   },
   {
    "src": "/legacy/members/photos/Capstan.gif",
    "name": "Capstan",
    "bytes": 107036
   },
   {
    "src": "/legacy/members/photos/Chatsworth%20Jn2021.jpg",
    "name": "Chatsworth Jn2021",
    "bytes": 160444
   },
   {
    "src": "/legacy/members/photos/Chatsworth.JPG",
    "name": "Chatsworth",
    "bytes": 72599
   },
   {
    "src": "/legacy/members/photos/CldtzCock.jpg",
    "name": "Cldtz Cock",
    "bytes": 18008
   },
   {
    "src": "/legacy/members/photos/ClubCar.jpg",
    "name": "Club Car",
    "bytes": 71288
   },
   {
    "src": "/legacy/members/photos/CmpLn170923.jpg",
    "name": "Cmp Ln170923",
    "bytes": 79470
   },
   {
    "src": "/legacy/members/photos/CntryFile1.jpg",
    "name": "Cntry File1",
    "bytes": 49388
   },
   {
    "src": "/legacy/members/photos/CntryFile2.jpg",
    "name": "Cntry File2",
    "bytes": 41585
   },
   {
    "src": "/legacy/members/photos/ConvLine150406.gif",
    "name": "Conv Line150406",
    "bytes": 77155
   },
   {
    "src": "/legacy/members/photos/DMartinField.jpg",
    "name": "DMartin Field",
    "bytes": 63303
   },
   {
    "src": "/legacy/members/photos/DS120723.jpg",
    "name": "DS120723",
    "bytes": 18618
   },
   {
    "src": "/legacy/members/photos/Dams090121.jpg",
    "name": "Dams090121",
    "bytes": 12058
   },
   {
    "src": "/legacy/members/photos/DanceRichLect.jpg",
    "name": "Dance Rich Lect",
    "bytes": 34199
   },
   {
    "src": "/legacy/members/photos/Dave%20Upcott.jpg",
    "name": "Dave Upcott",
    "bytes": 17257
   },
   {
    "src": "/legacy/members/photos/DaveLeeWD.jpg",
    "name": "Dave Lee WD",
    "bytes": 21643
   },
   {
    "src": "/legacy/members/photos/DaveM.jpg",
    "name": "Dave M",
    "bytes": 24658
   },
   {
    "src": "/legacy/members/photos/DblRnbw10.10.14.gif",
    "name": "Dbl Rnbw10.10.14",
    "bytes": 117841
   },
   {
    "src": "/legacy/members/photos/Defib-NewMarch2019.jpg",
    "name": "Defib-New March2019",
    "bytes": 38406
   },
   {
    "src": "/legacy/members/photos/DonMack%20Plaque.jpg",
    "name": "Don Mack Plaque",
    "bytes": 31877
   },
   {
    "src": "/legacy/members/photos/Dorothy.jpg",
    "name": "Dorothy",
    "bytes": 21339
   },
   {
    "src": "/legacy/members/photos/EBLCanopy.jpg",
    "name": "EBLCanopy",
    "bytes": 13770
   },
   {
    "src": "/legacy/members/photos/EBL_LastClean.jpg",
    "name": "EBL Last Clean",
    "bytes": 108036
   },
   {
    "src": "/legacy/members/photos/EKCFirstFlight.jpg",
    "name": "EKCFirst Flight",
    "bytes": 14964
   },
   {
    "src": "/legacy/members/photos/ERChtswrth.jpg",
    "name": "ERChtswrth",
    "bytes": 57382
   },
   {
    "src": "/legacy/members/photos/Eden001.jpg",
    "name": "Eden001",
    "bytes": 29530
   },
   {
    "src": "/legacy/members/photos/Edith92.jpg",
    "name": "Edith92",
    "bytes": 106966
   },
   {
    "src": "/legacy/members/photos/FireworksDM.jpg",
    "name": "Fireworks DM",
    "bytes": 46100
   },
   {
    "src": "/legacy/members/photos/FirstTrailerOnHoist.jpg",
    "name": "First Trailer On Hoist",
    "bytes": 132015
   },
   {
    "src": "/legacy/members/photos/FlyBy.jpg",
    "name": "Fly By",
    "bytes": 20499
   },
   {
    "src": "/legacy/members/photos/Gabriel%20Ng.jpg",
    "name": "Gabriel Ng",
    "bytes": 36284
   },
   {
    "src": "/legacy/members/photos/Geoff%20Cummner.jpg",
    "name": "Geoff Cummner",
    "bytes": 28148
   },
   {
    "src": "/legacy/members/photos/Gldr84.jpg",
    "name": "Gldr84",
    "bytes": 48594
   },
   {
    "src": "/legacy/members/photos/GlideGuideDogs2018.jpg",
    "name": "Glide Guide Dogs2018",
    "bytes": 147124
   },
   {
    "src": "/legacy/members/photos/Hans_SO_FirstFlight.jpg",
    "name": "Hans SO First Flight",
    "bytes": 77174
   },
   {
    "src": "/legacy/members/photos/HarbingerModel.jpg",
    "name": "Harbinger Model",
    "bytes": 54708
   },
   {
    "src": "/legacy/members/photos/Helicopters.jpg",
    "name": "Helicopters",
    "bytes": 59855
   },
   {
    "src": "/legacy/members/photos/HngrAprn.jpg",
    "name": "Hngr Aprn",
    "bytes": 62215
   },
   {
    "src": "/legacy/members/photos/HomePagePic275x186.jpg",
    "name": "Home Page Pic275x186",
    "bytes": 12707
   },
   {
    "src": "/legacy/members/photos/Howden28Jul12.jpg",
    "name": "Howden28Jul12",
    "bytes": 44117
   },
   {
    "src": "/legacy/members/photos/ICLRffrth.jpg",
    "name": "ICLRffrth",
    "bytes": 29661
   },
   {
    "src": "/legacy/members/photos/IMAG0269.jpg",
    "name": "IMAG0269",
    "bytes": 59310
   },
   {
    "src": "/legacy/members/photos/IMG-5335.jpg",
    "name": "IMG-5335",
    "bytes": 18153
   },
   {
    "src": "/legacy/members/photos/IMG_0272.jpg",
    "name": "IMG 0272",
    "bytes": 49519
   },
   {
    "src": "/legacy/members/photos/IMG_20140507_184422.jpg",
    "name": "IMG 20140507 184422",
    "bytes": 84284
   },
   {
    "src": "/legacy/members/photos/IMG_20140508_180010.jpg",
    "name": "IMG 20140508 180010",
    "bytes": 95896
   },
   {
    "src": "/legacy/members/photos/IMG_20140508_180055.jpg",
    "name": "IMG 20140508 180055",
    "bytes": 81129
   },
   {
    "src": "/legacy/members/photos/IMG_4405.jpg",
    "name": "IMG 4405",
    "bytes": 46280
   },
   {
    "src": "/legacy/members/photos/IOS%20Evng%20BA.jpg",
    "name": "IOS Evng BA",
    "bytes": 39644
   },
   {
    "src": "/legacy/members/photos/IOS%20Evng%20PG.jpg",
    "name": "IOS Evng PG",
    "bytes": 41852
   },
   {
    "src": "/legacy/members/photos/IndctnApr10.jpg",
    "name": "Indctn Apr10",
    "bytes": 48603
   },
   {
    "src": "/legacy/members/photos/InductionJuly.jpg",
    "name": "Induction July",
    "bytes": 46465
   },
   {
    "src": "/legacy/members/photos/InductionMay.jpg",
    "name": "Induction May",
    "bytes": 40130
   },
   {
    "src": "/legacy/members/photos/JKU%20rig2.jpg",
    "name": "JKU rig2",
    "bytes": 47164
   },
   {
    "src": "/legacy/members/photos/JKU%20rig5.jpg",
    "name": "JKU rig5",
    "bytes": 39164
   },
   {
    "src": "/legacy/members/photos/JKU%20rig6.jpg",
    "name": "JKU rig6",
    "bytes": 34744
   },
   {
    "src": "/legacy/members/photos/JKU-Cleaning.jpg",
    "name": "JKU-Cleaning",
    "bytes": 82218
   },
   {
    "src": "/legacy/members/photos/JKU-FirstDay.jpg",
    "name": "JKU-First Day",
    "bytes": 64989
   },
   {
    "src": "/legacy/members/photos/JMcK-WD.jpg",
    "name": "JMc K-WD",
    "bytes": 341856
   },
   {
    "src": "/legacy/members/photos/JRJday1.jpg",
    "name": "JRJday1",
    "bytes": 65958
   },
   {
    "src": "/legacy/members/photos/JRJday1A.jpg",
    "name": "JRJday1A",
    "bytes": 91264
   },
   {
    "src": "/legacy/members/photos/JohnSconce.jpg",
    "name": "John Sconce",
    "bytes": 21127
   },
   {
    "src": "/legacy/members/photos/JuniorPH13930017.jpg",
    "name": "Junior PH13930017",
    "bytes": 27888
   },
   {
    "src": "/legacy/members/photos/KRB%20FirstDay.jpg",
    "name": "KRB First Day",
    "bytes": 54375
   },
   {
    "src": "/legacy/members/photos/KRBfinishedA.jpg",
    "name": "KRBfinished A",
    "bytes": 54334
   },
   {
    "src": "/legacy/members/photos/KRBfinishedB.jpg",
    "name": "KRBfinished B",
    "bytes": 42085
   },
   {
    "src": "/legacy/members/photos/KRBfinishedC.jpg",
    "name": "KRBfinished C",
    "bytes": 61280
   },
   {
    "src": "/legacy/members/photos/KRBfinishedD.jpg",
    "name": "KRBfinished D",
    "bytes": 50302
   },
   {
    "src": "/legacy/members/photos/KRBtest.jpg",
    "name": "KRBtest",
    "bytes": 35714
   },
   {
    "src": "/legacy/members/photos/KathyPage1.jpg",
    "name": "Kathy Page1",
    "bytes": 34618
   },
   {
    "src": "/legacy/members/photos/KathyPage2.jpg",
    "name": "Kathy Page2",
    "bytes": 50237
   },
   {
    "src": "/legacy/members/photos/LPV%20Clean%20Knsfd%20Jnrs%20May2019.jpg",
    "name": "LPV Clean Knsfd Jnrs May2019",
    "bytes": 66511
   },
   {
    "src": "/legacy/members/photos/Ldybwr2010Aug.jpg",
    "name": "Ldybwr2010Aug",
    "bytes": 59731
   },
   {
    "src": "/legacy/members/photos/LlangorseLake.jpg",
    "name": "Llangorse Lake",
    "bytes": 38796
   },
   {
    "src": "/legacy/members/photos/LongDayDawn2016.jpg",
    "name": "Long Day Dawn2016",
    "bytes": 31656
   },
   {
    "src": "/legacy/members/photos/LongDayFancDressA.jpg",
    "name": "Long Day Fanc Dress A",
    "bytes": 44047
   },
   {
    "src": "/legacy/members/photos/LongDayFancDressB.jpg",
    "name": "Long Day Fanc Dress B",
    "bytes": 89813
   },
   {
    "src": "/legacy/members/photos/LongDayFancDressC.jpg",
    "name": "Long Day Fanc Dress C",
    "bytes": 119147
   },
   {
    "src": "/legacy/members/photos/LongDayFandDressD.jpg",
    "name": "Long Day Fand Dress D",
    "bytes": 138856
   },
   {
    "src": "/legacy/members/photos/LoseHill301011.jpg",
    "name": "Lose Hill301011",
    "bytes": 45671
   },
   {
    "src": "/legacy/members/photos/LotsOfModels.jpg",
    "name": "Lots Of Models",
    "bytes": 64419
   },
   {
    "src": "/legacy/members/photos/M1Junction29.jpg",
    "name": "M1Junction29",
    "bytes": 51225
   },
   {
    "src": "/legacy/members/photos/MA%20210613.jpg",
    "name": "MA 210613",
    "bytes": 27499
   },
   {
    "src": "/legacy/members/photos/MBBuxton%20and%20Quarry.jpg",
    "name": "MBBuxton and Quarry",
    "bytes": 32869
   },
   {
    "src": "/legacy/members/photos/MBCamphill%20from%20behind%20Barrell.jpg",
    "name": "MBCamphill from behind Barrell",
    "bytes": 35344
   },
   {
    "src": "/legacy/members/photos/MBCementWorks%26Peak.jpg",
    "name": "MBCement Works&Peak",
    "bytes": 42818
   },
   {
    "src": "/legacy/members/photos/MBColourful%20Dove%20Holes%21.jpg",
    "name": "MBColourful Dove Holes!",
    "bytes": 47029
   },
   {
    "src": "/legacy/members/photos/MBTunstead%20Cement%20Works.jpg",
    "name": "MBTunstead Cement Works",
    "bytes": 53416
   },
   {
    "src": "/legacy/members/photos/MBushell1.jpg",
    "name": "MBushell1",
    "bytes": 63236
   },
   {
    "src": "/legacy/members/photos/MBushell3.jpg",
    "name": "MBushell3",
    "bytes": 93857
   },
   {
    "src": "/legacy/members/photos/MRT%20%26%20Coastguard%20S92.jpg",
    "name": "MRT & Coastguard S92",
    "bytes": 39616
   },
   {
    "src": "/legacy/members/photos/MamTor.jpg",
    "name": "Mam Tor",
    "bytes": 34185
   },
   {
    "src": "/legacy/members/photos/ManchApt1.jpg",
    "name": "Manch Apt1",
    "bytes": 101035
   },
   {
    "src": "/legacy/members/photos/ManchApt2.jpg",
    "name": "Manch Apt2",
    "bytes": 99942
   },
   {
    "src": "/legacy/members/photos/ManchApt3.jpg",
    "name": "Manch Apt3",
    "bytes": 84807
   },
   {
    "src": "/legacy/members/photos/MarkWrangham.jpg",
    "name": "Mark Wrangham",
    "bytes": 67415
   },
   {
    "src": "/legacy/members/photos/Martin-022.jpg",
    "name": "Martin-022",
    "bytes": 196231
   },
   {
    "src": "/legacy/members/photos/Mbushell2.jpg",
    "name": "Mbushell2",
    "bytes": 130637
   },
   {
    "src": "/legacy/members/photos/MdWkPlts100308.jpg",
    "name": "Md Wk Plts100308",
    "bytes": 50708
   },
   {
    "src": "/legacy/members/photos/MichealCarterWD.jpg",
    "name": "Micheal Carter WD",
    "bytes": 32788
   },
   {
    "src": "/legacy/members/photos/MikeFox%26PG.jpg",
    "name": "Mike Fox&PG",
    "bytes": 66820
   },
   {
    "src": "/legacy/members/photos/MilfieldA.jpg",
    "name": "Milfield A",
    "bytes": 27353
   },
   {
    "src": "/legacy/members/photos/MilfieldB.jpg",
    "name": "Milfield B",
    "bytes": 44785
   },
   {
    "src": "/legacy/members/photos/Model.jpg",
    "name": "Model",
    "bytes": 31105
   },
   {
    "src": "/legacy/members/photos/MouseNest.jpg",
    "name": "Mouse Nest",
    "bytes": 51404
   },
   {
    "src": "/legacy/members/photos/Mower1016AugA.jpg",
    "name": "Mower1016Aug A",
    "bytes": 147074
   },
   {
    "src": "/legacy/members/photos/Mower2016AugB.jpg",
    "name": "Mower2016Aug B",
    "bytes": 160973
   },
   {
    "src": "/legacy/members/photos/NMcCAeros1.jpg",
    "name": "NMc CAeros1",
    "bytes": 31597
   },
   {
    "src": "/legacy/members/photos/NMcCAeros2.jpg",
    "name": "NMc CAeros2",
    "bytes": 32576
   },
   {
    "src": "/legacy/members/photos/NMcCAeros3.jpg",
    "name": "NMc CAeros3",
    "bytes": 19318
   },
   {
    "src": "/legacy/members/photos/NewBus301007.jpg",
    "name": "New Bus301007",
    "bytes": 59126
   },
   {
    "src": "/legacy/members/photos/NewGrass.jpg",
    "name": "New Grass",
    "bytes": 28701
   },
   {
    "src": "/legacy/members/photos/NorthEnd151221.jpg",
    "name": "North End151221",
    "bytes": 39748
   },
   {
    "src": "/legacy/members/photos/NotClrInFrnt.jpg",
    "name": "Not Clr In Frnt",
    "bytes": 89916
   },
   {
    "src": "/legacy/members/photos/OE12%20BTF.jpg",
    "name": "OE12 BTF",
    "bytes": 43451
   },
   {
    "src": "/legacy/members/photos/OGNAntenna.jpg",
    "name": "OGNAntenna",
    "bytes": 42540
   },
   {
    "src": "/legacy/members/photos/Orchid.jpg",
    "name": "Orchid",
    "bytes": 60230
   },
   {
    "src": "/legacy/members/photos/Orchid2.jpg",
    "name": "Orchid2",
    "bytes": 24583
   },
   {
    "src": "/legacy/members/photos/OrchidGroup2090611.jpg",
    "name": "Orchid Group2090611",
    "bytes": 101675
   },
   {
    "src": "/legacy/members/photos/OrchidSingle090611.jpg",
    "name": "Orchid Single090611",
    "bytes": 51606
   },
   {
    "src": "/legacy/members/photos/OrchidsJanS0906.jpg",
    "name": "Orchids Jan S0906",
    "bytes": 66324
   },
   {
    "src": "/legacy/members/photos/Orographic.jpg",
    "name": "Orographic",
    "bytes": 37396
   },
   {
    "src": "/legacy/members/photos/P1010904%20Bakewell%20Show%20ground.jpg",
    "name": "P1010904 Bakewell Show ground",
    "bytes": 79571
   },
   {
    "src": "/legacy/members/photos/P9230023.jpg",
    "name": "P9230023",
    "bytes": 59855
   },
   {
    "src": "/legacy/members/photos/PC090092.JPG",
    "name": "PC090092",
    "bytes": 52428
   },
   {
    "src": "/legacy/members/photos/PC090095.JPG",
    "name": "PC090095",
    "bytes": 44659
   },
   {
    "src": "/legacy/members/photos/PGill210616.jpg",
    "name": "PGill210616",
    "bytes": 21213
   },
   {
    "src": "/legacy/members/photos/PHarrisSilverDist.jpg",
    "name": "PHarris Silver Dist",
    "bytes": 57326
   },
   {
    "src": "/legacy/members/photos/PairCapstans.jpg",
    "name": "Pair Capstans",
    "bytes": 97305
   },
   {
    "src": "/legacy/members/photos/PatTurner.jpg",
    "name": "Pat Turner",
    "bytes": 148176
   },
   {
    "src": "/legacy/members/photos/PeteGreyl.jpg",
    "name": "Pete Greyl",
    "bytes": 49086
   },
   {
    "src": "/legacy/members/photos/Pheasant%20trying%20to%20fly.jpg",
    "name": "Pheasant trying to fly",
    "bytes": 112616
   },
   {
    "src": "/legacy/members/photos/Pigeon.jpg",
    "name": "Pigeon",
    "bytes": 44166
   },
   {
    "src": "/legacy/members/photos/Pizza1.jpg",
    "name": "Pizza1",
    "bytes": 32617
   },
   {
    "src": "/legacy/members/photos/Pizza2.jpg",
    "name": "Pizza2",
    "bytes": 33139
   },
   {
    "src": "/legacy/members/photos/PlcHeliA.jpg",
    "name": "Plc Heli A",
    "bytes": 55035
   },
   {
    "src": "/legacy/members/photos/PlcHeliB.jpg",
    "name": "Plc Heli B",
    "bytes": 40054
   },
   {
    "src": "/legacy/members/photos/PlcHeliC.jpg",
    "name": "Plc Heli C",
    "bytes": 41125
   },
   {
    "src": "/legacy/members/photos/PlcHeliSmll.jpg",
    "name": "Plc Heli Smll",
    "bytes": 14404
   },
   {
    "src": "/legacy/members/photos/ProjFibre1.jpg",
    "name": "Proj Fibre1",
    "bytes": 46343
   },
   {
    "src": "/legacy/members/photos/RFinControl.jpg",
    "name": "RFin Control",
    "bytes": 29125
   },
   {
    "src": "/legacy/members/photos/RcktSetUp1.jpg",
    "name": "Rckt Set Up1",
    "bytes": 60556
   },
   {
    "src": "/legacy/members/photos/RcktSetUp2.jpg",
    "name": "Rckt Set Up2",
    "bytes": 68417
   },
   {
    "src": "/legacy/members/photos/RebellionKnoll151121.jpg",
    "name": "Rebellion Knoll151121",
    "bytes": 36862
   },
   {
    "src": "/legacy/members/photos/RoadDrilling1.jpg",
    "name": "Road Drilling1",
    "bytes": 312902
   },
   {
    "src": "/legacy/members/photos/RoadDrilling2.jpg",
    "name": "Road Drilling2",
    "bytes": 159425
   },
   {
    "src": "/legacy/members/photos/RoadDrilling3.jpg",
    "name": "Road Drilling3",
    "bytes": 179363
   },
   {
    "src": "/legacy/members/photos/RomeoJuliet.jpg",
    "name": "Romeo Juliet",
    "bytes": 40063
   },
   {
    "src": "/legacy/members/photos/Rory%20Atlasi-Barker.jpg",
    "name": "Rory Atlasi-Barker",
    "bytes": 24714
   },
   {
    "src": "/legacy/members/photos/S%20RIDGE%20BARREL.jpg",
    "name": "S RIDGE BARREL",
    "bytes": 53611
   },
   {
    "src": "/legacy/members/photos/SAM_0138.jpg",
    "name": "SAM 0138",
    "bytes": 12907
   },
   {
    "src": "/legacy/members/photos/SAM_0139.jpg",
    "name": "SAM 0139",
    "bytes": 29976
   },
   {
    "src": "/legacy/members/photos/SAM_0139s.jpg",
    "name": "SAM 0139s",
    "bytes": 13067
   },
   {
    "src": "/legacy/members/photos/SfromCPH180118AOldham.jpg",
    "name": "Sfrom CPH180118AOldham",
    "bytes": 25037
   },
   {
    "src": "/legacy/members/photos/ShirleyJohnston.jpg",
    "name": "Shirley Johnston",
    "bytes": 19591
   },
   {
    "src": "/legacy/members/photos/Shower140321.jpg",
    "name": "Shower140321",
    "bytes": 27213
   },
   {
    "src": "/legacy/members/photos/Shut24Jul2012.2.jpg",
    "name": "Shut24Jul2012.2",
    "bytes": 59929
   },
   {
    "src": "/legacy/members/photos/Shut24Jul2012.jpg",
    "name": "Shut24Jul2012",
    "bytes": 43246
   },
   {
    "src": "/legacy/members/photos/Simon%20S%201st%20Instruct.jpg",
    "name": "Simon S 1st Instruct",
    "bytes": 45371
   },
   {
    "src": "/legacy/members/photos/Simon%20Stannard%20Filed%20Lndg.png",
    "name": "Simon Stannard Filed Lndg",
    "bytes": 156856
   },
   {
    "src": "/legacy/members/photos/SkyL140204A.jpg",
    "name": "Sky L140204A",
    "bytes": 50720
   },
   {
    "src": "/legacy/members/photos/SkyL140204B.jpg",
    "name": "Sky L140204B",
    "bytes": 55188
   },
   {
    "src": "/legacy/members/photos/SmmrSolst090621.jpg",
    "name": "Smmr Solst090621",
    "bytes": 25327
   },
   {
    "src": "/legacy/members/photos/SnstLongstDay.jpg",
    "name": "Snst Longst Day",
    "bytes": 53297
   },
   {
    "src": "/legacy/members/photos/Sophiie%20Gardenner%20VR%20Visitor.jpg",
    "name": "Sophiie Gardenner VR Visitor",
    "bytes": 101333
   },
   {
    "src": "/legacy/members/photos/SouthEndMud.jpg",
    "name": "South End Mud",
    "bytes": 62252
   },
   {
    "src": "/legacy/members/photos/Spraybay1.jpg",
    "name": "Spraybay1",
    "bytes": 138492
   },
   {
    "src": "/legacy/members/photos/Spraybay2.jpg",
    "name": "Spraybay2",
    "bytes": 139330
   },
   {
    "src": "/legacy/members/photos/Steve%20Marlor%20Hartley.jpg",
    "name": "Steve Marlor Hartley",
    "bytes": 159833
   },
   {
    "src": "/legacy/members/photos/Stocksbridge.jpg",
    "name": "Stocksbridge",
    "bytes": 50639
   },
   {
    "src": "/legacy/members/photos/SunnyDec14Satday.jpg",
    "name": "Sunny Dec14Satday",
    "bytes": 68163
   },
   {
    "src": "/legacy/members/photos/SylvNwsPPr.jpg",
    "name": "Sylv Nws PPr",
    "bytes": 25309
   },
   {
    "src": "/legacy/members/photos/SylviaInsley.jpg",
    "name": "Sylvia Insley",
    "bytes": 103001
   },
   {
    "src": "/legacy/members/photos/TW2012A.jpg",
    "name": "TW2012A",
    "bytes": 52713
   },
   {
    "src": "/legacy/members/photos/TW2012E.jpg",
    "name": "TW2012E",
    "bytes": 52251
   },
   {
    "src": "/legacy/members/photos/TW2012F.jpg",
    "name": "TW2012F",
    "bytes": 60816
   },
   {
    "src": "/legacy/members/photos/The%20Fire500W.jpg",
    "name": "The Fire500W",
    "bytes": 50192
   },
   {
    "src": "/legacy/members/photos/TigerMothJul16A.jpg",
    "name": "Tiger Moth Jul16A",
    "bytes": 85403
   },
   {
    "src": "/legacy/members/photos/TigerMothJul16B.jpg",
    "name": "Tiger Moth Jul16B",
    "bytes": 113099
   },
   {
    "src": "/legacy/members/photos/TreeFelling4.jpg",
    "name": "Tree Felling4",
    "bytes": 36269
   },
   {
    "src": "/legacy/members/photos/TrishSmith.jpg",
    "name": "Trish Smith",
    "bytes": 106383
   },
   {
    "src": "/legacy/members/photos/TroyWoodScout.jpg",
    "name": "Troy Wood Scout",
    "bytes": 65927
   },
   {
    "src": "/legacy/members/photos/Tulips.gif",
    "name": "Tulips",
    "bytes": 144718
   },
   {
    "src": "/legacy/members/photos/Tulips2.gif",
    "name": "Tulips2",
    "bytes": 132221
   },
   {
    "src": "/legacy/members/photos/VintRallyGalaDesert.jpg",
    "name": "Vint Rally Gala Desert",
    "bytes": 49735
   },
   {
    "src": "/legacy/members/photos/VintWkShp.jpg",
    "name": "Vint Wk Shp",
    "bytes": 46061
   },
   {
    "src": "/legacy/members/photos/VirgBlln130516.jpg",
    "name": "Virg Blln130516",
    "bytes": 60930
   },
   {
    "src": "/legacy/members/photos/VllyFogBrdwllDanR.jpg",
    "name": "Vlly Fog Brdwll Dan R",
    "bytes": 33199
   },
   {
    "src": "/legacy/members/photos/WH%20300km%2016.4.21.jpg",
    "name": "WH 300km 16.4.21",
    "bytes": 58580
   },
   {
    "src": "/legacy/members/photos/WHorneField.jpg",
    "name": "WHorne Field",
    "bytes": 64714
   },
   {
    "src": "/legacy/members/photos/Wall.jpg",
    "name": "Wall",
    "bytes": 108789
   },
   {
    "src": "/legacy/members/photos/What%20the%20beef%20John.jpg",
    "name": "What the beef John",
    "bytes": 77516
   },
   {
    "src": "/legacy/members/photos/WindyWendy11-01-17.jpg",
    "name": "Windy Wendy11-01-17",
    "bytes": 60866
   },
   {
    "src": "/legacy/members/photos/WintLectAudce.jpg",
    "name": "Wint Lect Audce",
    "bytes": 28196
   },
   {
    "src": "/legacy/members/photos/WndsckSunset.jpg",
    "name": "Wndsck Sunset",
    "bytes": 68072
   },
   {
    "src": "/legacy/members/photos/ac_wrkshp_apron_May2019.jpg",
    "name": "Ac wrkshp apron May2019",
    "bytes": 80520
   },
   {
    "src": "/legacy/members/photos/airfield100604.gif",
    "name": "Airfield100604",
    "bytes": 135473
   },
   {
    "src": "/legacy/members/photos/balloon2.jpg",
    "name": "Balloon2",
    "bytes": 101758
   },
   {
    "src": "/legacy/members/photos/balloon3.jpg",
    "name": "Balloon3",
    "bytes": 64381
   },
   {
    "src": "/legacy/members/photos/balloon4.jpg",
    "name": "Balloon4",
    "bytes": 71416
   },
   {
    "src": "/legacy/members/photos/bunny.jpg",
    "name": "Bunny",
    "bytes": 66945
   },
   {
    "src": "/legacy/members/photos/camphillfrom%20Airway.jpg",
    "name": "Camphillfrom Airway",
    "bytes": 40567
   },
   {
    "src": "/legacy/members/photos/early18aug1.jpg",
    "name": "Early18aug1",
    "bytes": 77966
   },
   {
    "src": "/legacy/members/photos/early18aug2.jpg",
    "name": "Early18aug2",
    "bytes": 79845
   },
   {
    "src": "/legacy/members/photos/fireworks%20041.jpg",
    "name": "Fireworks 041",
    "bytes": 86266
   },
   {
    "src": "/legacy/members/photos/fireworks%20058.jpg",
    "name": "Fireworks 058",
    "bytes": 71346
   },
   {
    "src": "/legacy/members/photos/fireworks%20059.jpg",
    "name": "Fireworks 059",
    "bytes": 88601
   },
   {
    "src": "/legacy/members/photos/kinder100311.jpg",
    "name": "Kinder100311",
    "bytes": 35955
   },
   {
    "src": "/legacy/members/photos/pilots.jpg",
    "name": "Pilots",
    "bytes": 34955
   },
   {
    "src": "/legacy/members/photos/rockery.gif",
    "name": "Rockery",
    "bytes": 154459
   },
   {
    "src": "/legacy/members/photos/sean01.jpg",
    "name": "Sean01",
    "bytes": 75303
   },
   {
    "src": "/legacy/members/photos/virga%201.jpg",
    "name": "Virga 1",
    "bytes": 19705
   },
   {
    "src": "/legacy/members/photos/virga%202.jpg",
    "name": "Virga 2",
    "bytes": 16447
   },
   {
    "src": "/legacy/members/photos/windsock3.jpg",
    "name": "Windsock3",
    "bytes": 16081
   }
  ]
 },
 {
  "slug": "first-solos",
  "title": "First Solos",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/AChappellSolo.jpg",
    "name": "AChappell Solo",
    "bytes": 77121
   },
   {
    "src": "/legacy/members/photos/AdrainLongSolo.jpg",
    "name": "Adrain Long Solo",
    "bytes": 52884
   },
   {
    "src": "/legacy/members/photos/AlanHallSolo.jpg",
    "name": "Alan Hall Solo",
    "bytes": 48836
   },
   {
    "src": "/legacy/members/photos/AlexOldhamSolo.jpg",
    "name": "Alex Oldham Solo",
    "bytes": 162043
   },
   {
    "src": "/legacy/members/photos/AndyLomasSolo.jpg",
    "name": "Andy Lomas Solo",
    "bytes": 33827
   },
   {
    "src": "/legacy/members/photos/AndyWSolo.jpg",
    "name": "Andy WSolo",
    "bytes": 100317
   },
   {
    "src": "/legacy/members/photos/ArvydasSolo2.jpg",
    "name": "Arvydas Solo2",
    "bytes": 81353
   },
   {
    "src": "/legacy/members/photos/B%20Whalley%20Solo.jpg",
    "name": "B Whalley Solo",
    "bytes": 39822
   },
   {
    "src": "/legacy/members/photos/BasSonnSolo.JPG",
    "name": "Bas Sonn Solo",
    "bytes": 72880
   },
   {
    "src": "/legacy/members/photos/BenRichardsonSolo.jpg",
    "name": "Ben Richardson Solo",
    "bytes": 107015
   },
   {
    "src": "/legacy/members/photos/Brian%20Whalley%20Solo.jpg",
    "name": "Brian Whalley Solo",
    "bytes": 65436
   },
   {
    "src": "/legacy/members/photos/ChrisBSolo.jpg",
    "name": "Chris BSolo",
    "bytes": 56195
   },
   {
    "src": "/legacy/members/photos/Christina%20Naylor%20%28Aston%20Down%29%20Solo.jpg",
    "name": "Christina Naylor (Aston Down) Solo",
    "bytes": 41842
   },
   {
    "src": "/legacy/members/photos/Colin%20Harper%20solo.jpg",
    "name": "Colin Harper solo",
    "bytes": 92540
   },
   {
    "src": "/legacy/members/photos/ColinEllisSolo.jpg",
    "name": "Colin Ellis Solo",
    "bytes": 64063
   },
   {
    "src": "/legacy/members/photos/ColinTaylorSolo.jpg",
    "name": "Colin Taylor Solo",
    "bytes": 47916
   },
   {
    "src": "/legacy/members/photos/CraigHopkinsSolo.jpg",
    "name": "Craig Hopkins Solo",
    "bytes": 32809
   },
   {
    "src": "/legacy/members/photos/DBeebySolo.jpg",
    "name": "DBeeby Solo",
    "bytes": 41775
   },
   {
    "src": "/legacy/members/photos/DM%20Resolo%2020220425.jpg",
    "name": "DM Resolo 20220425",
    "bytes": 190512
   },
   {
    "src": "/legacy/members/photos/DSpencerSolo.jpg",
    "name": "DSpencer Solo",
    "bytes": 56164
   },
   {
    "src": "/legacy/members/photos/DanClaytonSolo.jpg",
    "name": "Dan Clayton Solo",
    "bytes": 49957
   },
   {
    "src": "/legacy/members/photos/DanCsolo.jpg",
    "name": "Dan Csolo",
    "bytes": 65362
   },
   {
    "src": "/legacy/members/photos/Daniel%20%20P%20Sousa%20Solo.jpg",
    "name": "Daniel P Sousa Solo",
    "bytes": 42774
   },
   {
    "src": "/legacy/members/photos/DaveLeeFstSolo.jpg",
    "name": "Dave Lee Fst Solo",
    "bytes": 57305
   },
   {
    "src": "/legacy/members/photos/DaveLeeRe-Solo.jpg",
    "name": "Dave Lee Re-Solo",
    "bytes": 137264
   },
   {
    "src": "/legacy/members/photos/David%20Shaw%20Solo.jpg",
    "name": "David Shaw Solo",
    "bytes": 78072
   },
   {
    "src": "/legacy/members/photos/Doug%20Lambert%20Solo.jpg",
    "name": "Doug Lambert Solo",
    "bytes": 52667
   },
   {
    "src": "/legacy/members/photos/Ed%20Browne%20solo.png",
    "name": "Ed Browne solo",
    "bytes": 638088
   },
   {
    "src": "/legacy/members/photos/FilipPawlakSolo.jpg",
    "name": "Filip Pawlak Solo",
    "bytes": 61826
   },
   {
    "src": "/legacy/members/photos/Francesco%20Silva%20Solo.jpg",
    "name": "Francesco Silva Solo",
    "bytes": 62110
   },
   {
    "src": "/legacy/members/photos/GAblottSolo.jpg",
    "name": "GAblott Solo",
    "bytes": 72880
   },
   {
    "src": "/legacy/members/photos/Harrison%20Phillips%20Solo.JPG",
    "name": "Harrison Phillips Solo",
    "bytes": 48275
   },
   {
    "src": "/legacy/members/photos/J%20McK%20resolo%20100315.jpg",
    "name": "J Mc K resolo 100315",
    "bytes": 172119
   },
   {
    "src": "/legacy/members/photos/JMcK%20ResoloFlight.jpg",
    "name": "JMc K Resolo Flight",
    "bytes": 172819
   },
   {
    "src": "/legacy/members/photos/Jake%20Openshaw%20Solo.JPG",
    "name": "Jake Openshaw Solo",
    "bytes": 74985
   },
   {
    "src": "/legacy/members/photos/JamieT-Solo.jpg",
    "name": "Jamie T-Solo",
    "bytes": 99217
   },
   {
    "src": "/legacy/members/photos/JasonAllunSolo.jpg",
    "name": "Jason Allun Solo",
    "bytes": 91994
   },
   {
    "src": "/legacy/members/photos/Jingtian%20Wang%20solo.jpg",
    "name": "Jingtian Wang solo",
    "bytes": 67316
   },
   {
    "src": "/legacy/members/photos/JonThorpeRe-Solo.jpg",
    "name": "Jon Thorpe Re-Solo",
    "bytes": 127334
   },
   {
    "src": "/legacy/members/photos/Liz%20Re%20solo.jpg",
    "name": "Liz Re solo",
    "bytes": 53908
   },
   {
    "src": "/legacy/members/photos/MattR1Solo.jpg",
    "name": "Matt R1Solo",
    "bytes": 102655
   },
   {
    "src": "/legacy/members/photos/MichalSamordakSolo.jpg",
    "name": "Michal Samordak Solo",
    "bytes": 107807
   },
   {
    "src": "/legacy/members/photos/MickF%27StoneSolo.jpg",
    "name": "Mick F'Stone Solo",
    "bytes": 61713
   },
   {
    "src": "/legacy/members/photos/MikePigginSolo.jpg",
    "name": "Mike Piggin Solo",
    "bytes": 24927
   },
   {
    "src": "/legacy/members/photos/MikeStephensSolo.jpg",
    "name": "Mike Stephens Solo",
    "bytes": 25998
   },
   {
    "src": "/legacy/members/photos/NAldredSolo.jpg",
    "name": "NAldred Solo",
    "bytes": 62679
   },
   {
    "src": "/legacy/members/photos/Nikhil%20Paradkar%20Solo%201.jpg",
    "name": "Nikhil Paradkar Solo 1",
    "bytes": 62293
   },
   {
    "src": "/legacy/members/photos/Nikhil%20Paradkar%20Solo%202.jpg",
    "name": "Nikhil Paradkar Solo 2",
    "bytes": 51614
   },
   {
    "src": "/legacy/members/photos/PWillerton1stSolo.jpg",
    "name": "PWillerton1st Solo",
    "bytes": 48057
   },
   {
    "src": "/legacy/members/photos/PeterGillSoloA.jpg",
    "name": "Peter Gill Solo A",
    "bytes": 69675
   },
   {
    "src": "/legacy/members/photos/PeterGillSoloB.jpg",
    "name": "Peter Gill Solo B",
    "bytes": 70749
   },
   {
    "src": "/legacy/members/photos/PeterGillSoloC.jpg",
    "name": "Peter Gill Solo C",
    "bytes": 50179
   },
   {
    "src": "/legacy/members/photos/PhilMaundSolo.jpg",
    "name": "Phil Maund Solo",
    "bytes": 105437
   },
   {
    "src": "/legacy/members/photos/RFentonSolo.jpg",
    "name": "RFenton Solo",
    "bytes": 33114
   },
   {
    "src": "/legacy/members/photos/Ray%20Yamin%20Re-solo.jpg",
    "name": "Ray Yamin Re-solo",
    "bytes": 72099
   },
   {
    "src": "/legacy/members/photos/Re-Solo%20Colin%20Taylor.png",
    "name": "Re-Solo Colin Taylor",
    "bytes": 399902
   },
   {
    "src": "/legacy/members/photos/Re-solo%20A%20Robinson.jpg",
    "name": "Re-solo A Robinson",
    "bytes": 135183
   },
   {
    "src": "/legacy/members/photos/ReSoloAlanWhittaker.jpg",
    "name": "Re Solo Alan Whittaker",
    "bytes": 137981
   },
   {
    "src": "/legacy/members/photos/RogerLucasSolo.jpg",
    "name": "Roger Lucas Solo",
    "bytes": 40571
   },
   {
    "src": "/legacy/members/photos/Solo%20-Tom%20Turner.png",
    "name": "Solo -Tom Turner",
    "bytes": 376678
   },
   {
    "src": "/legacy/members/photos/Solo%20Alex%20Sariban.jpg",
    "name": "Solo Alex Sariban",
    "bytes": 39979
   },
   {
    "src": "/legacy/members/photos/Solo%20Andy%20Gilbert.jpg",
    "name": "Solo Andy Gilbert",
    "bytes": 79986
   },
   {
    "src": "/legacy/members/photos/Solo%20Belle%20Tyler.jpg",
    "name": "Solo Belle Tyler",
    "bytes": 86756
   },
   {
    "src": "/legacy/members/photos/Solo%20Ben%20McIntyre.png",
    "name": "Solo Ben Mc Intyre",
    "bytes": 425484
   },
   {
    "src": "/legacy/members/photos/Solo%20D%20Heimerdinger.jpg",
    "name": "Solo D Heimerdinger",
    "bytes": 118866
   },
   {
    "src": "/legacy/members/photos/Solo%20Damien%20Reut.jpg",
    "name": "Solo Damien Reut",
    "bytes": 57436
   },
   {
    "src": "/legacy/members/photos/Solo%20Dave%20Richardson%20210516.jpg",
    "name": "Solo Dave Richardson 210516",
    "bytes": 137509
   },
   {
    "src": "/legacy/members/photos/Solo%20David%20Upcott.jpg",
    "name": "Solo David Upcott",
    "bytes": 42059
   },
   {
    "src": "/legacy/members/photos/Solo%20Ed%20Mayson.jpg",
    "name": "Solo Ed Mayson",
    "bytes": 73354
   },
   {
    "src": "/legacy/members/photos/Solo%20Eleanor%20Joinson.jpg",
    "name": "Solo Eleanor Joinson",
    "bytes": 99708
   },
   {
    "src": "/legacy/members/photos/Solo%20Filip%20Socha.jpg",
    "name": "Solo Filip Socha",
    "bytes": 53384
   },
   {
    "src": "/legacy/members/photos/Solo%20Jan%20Rush.jpg",
    "name": "Solo Jan Rush",
    "bytes": 111138
   },
   {
    "src": "/legacy/members/photos/Solo%20Martin%20Roberts.jpg",
    "name": "Solo Martin Roberts",
    "bytes": 106255
   },
   {
    "src": "/legacy/members/photos/Solo%20Maya%20Bertacche.jpg",
    "name": "Solo Maya Bertacche",
    "bytes": 49602
   },
   {
    "src": "/legacy/members/photos/Solo%20Meurig%20Thomas.jpg",
    "name": "Solo Meurig Thomas",
    "bytes": 63722
   },
   {
    "src": "/legacy/members/photos/Solo%20Oli%20Wilson.jpg",
    "name": "Solo Oli Wilson",
    "bytes": 76761
   },
   {
    "src": "/legacy/members/photos/Solo%20Owen%20Brown.jpg",
    "name": "Solo Owen Brown",
    "bytes": 140331
   },
   {
    "src": "/legacy/members/photos/Solo%20Richard%20Wilson.jpg",
    "name": "Solo Richard Wilson",
    "bytes": 78358
   },
   {
    "src": "/legacy/members/photos/Solo%20Steve%20Pearce.jpg",
    "name": "Solo Steve Pearce",
    "bytes": 166604
   },
   {
    "src": "/legacy/members/photos/SoloAlisonWheeler180514.jpg",
    "name": "Solo Alison Wheeler180514",
    "bytes": 60983
   },
   {
    "src": "/legacy/members/photos/SoloAnyMills.jpg",
    "name": "Solo Any Mills",
    "bytes": 107533
   },
   {
    "src": "/legacy/members/photos/SoloDGoddard.jpg",
    "name": "Solo DGoddard",
    "bytes": 45749
   },
   {
    "src": "/legacy/members/photos/SoloIanMyles180504.jpg",
    "name": "Solo Ian Myles180504",
    "bytes": 62203
   },
   {
    "src": "/legacy/members/photos/SoloIgorG.jpg",
    "name": "Solo Igor G",
    "bytes": 96467
   },
   {
    "src": "/legacy/members/photos/SoloJBruce.jpg",
    "name": "Solo JBruce",
    "bytes": 102961
   },
   {
    "src": "/legacy/members/photos/SoloJimWeatherhead.jpg",
    "name": "Solo Jim Weatherhead",
    "bytes": 99726
   },
   {
    "src": "/legacy/members/photos/SoloMaciej_Chmura.jpg",
    "name": "Solo Maciej Chmura",
    "bytes": 83015
   },
   {
    "src": "/legacy/members/photos/SoloMartinWilcox.jpg",
    "name": "Solo Martin Wilcox",
    "bytes": 42896
   },
   {
    "src": "/legacy/members/photos/SoloTimSnow.jpg",
    "name": "Solo Tim Snow",
    "bytes": 120366
   },
   {
    "src": "/legacy/members/photos/SoloTonyA.jpg",
    "name": "Solo Tony A",
    "bytes": 55440
   },
   {
    "src": "/legacy/members/photos/Solo_Ellis_Brennan.jpg",
    "name": "Solo Ellis Brennan",
    "bytes": 75046
   },
   {
    "src": "/legacy/members/photos/Solo_Emilien_Braun.jpg",
    "name": "Solo Emilien Braun",
    "bytes": 140057
   },
   {
    "src": "/legacy/members/photos/Solo_JoshuaBoissery.jpg",
    "name": "Solo Joshua Boissery",
    "bytes": 55400
   },
   {
    "src": "/legacy/members/photos/Solo_Mike_Carter_3.6.21.jpg",
    "name": "Solo Mike Carter 3.6.21",
    "bytes": 69529
   },
   {
    "src": "/legacy/members/photos/Solo_Norbert%20Keck.jpg",
    "name": "Solo Norbert Keck",
    "bytes": 183526
   },
   {
    "src": "/legacy/members/photos/Solo_Paul%20Smith.jpg",
    "name": "Solo Paul Smith",
    "bytes": 46065
   },
   {
    "src": "/legacy/members/photos/Solo_Quinn_Cameron_Faulkner.jpg",
    "name": "Solo Quinn Cameron Faulkner",
    "bytes": 32592
   },
   {
    "src": "/legacy/members/photos/Solo_RobHarman.jpg",
    "name": "Solo Rob Harman",
    "bytes": 72635
   },
   {
    "src": "/legacy/members/photos/Solo_Tai-Ying-Lee.jpg",
    "name": "Solo Tai-Ying-Lee",
    "bytes": 83903
   },
   {
    "src": "/legacy/members/photos/StannardSolo.jpg",
    "name": "Stannard Solo",
    "bytes": 24280
   },
   {
    "src": "/legacy/members/photos/SteveHillSolo.jpg",
    "name": "Steve Hill Solo",
    "bytes": 57530
   },
   {
    "src": "/legacy/members/photos/SteveMarlorSolo.jpg",
    "name": "Steve Marlor Solo",
    "bytes": 41734
   },
   {
    "src": "/legacy/members/photos/SuzieEsolo.jpg",
    "name": "Suzie Esolo",
    "bytes": 86819
   },
   {
    "src": "/legacy/members/photos/SylviaSolo.jpg",
    "name": "Sylvia Solo",
    "bytes": 51510
   },
   {
    "src": "/legacy/members/photos/TMorleySolo.jpg",
    "name": "TMorley Solo",
    "bytes": 40767
   },
   {
    "src": "/legacy/members/photos/TimPearsonSolo.jpg",
    "name": "Tim Pearson Solo",
    "bytes": 109669
   },
   {
    "src": "/legacy/members/photos/Tom%20Oldfield%20Solo.JPG",
    "name": "Tom Oldfield Solo",
    "bytes": 68493
   },
   {
    "src": "/legacy/members/photos/TonyKaySolo.jpg",
    "name": "Tony Kay Solo",
    "bytes": 46427
   },
   {
    "src": "/legacy/members/photos/WRoperSolo.jpg",
    "name": "WRoper Solo",
    "bytes": 51230
   },
   {
    "src": "/legacy/members/photos/Will%20Frost%20Solo.jpg",
    "name": "Will Frost Solo",
    "bytes": 65192
   },
   {
    "src": "/legacy/members/photos/davejonessolo.gif",
    "name": "Davejonessolo",
    "bytes": 105130
   },
   {
    "src": "/legacy/members/photos/davereeediesolo.gif",
    "name": "Davereeediesolo",
    "bytes": 122711
   },
   {
    "src": "/legacy/members/photos/deansolo1.jpg",
    "name": "Deansolo1",
    "bytes": 67374
   },
   {
    "src": "/legacy/members/photos/fFilipPawlakSolo2.jpg",
    "name": "F Filip Pawlak Solo2",
    "bytes": 72191
   },
   {
    "src": "/legacy/members/photos/garryLsolo.jpg",
    "name": "Garry Lsolo",
    "bytes": 55967
   },
   {
    "src": "/legacy/members/photos/markstokessolo.gif",
    "name": "Markstokessolo",
    "bytes": 85209
   },
   {
    "src": "/legacy/members/photos/patturnersolo.jpg",
    "name": "Patturnersolo",
    "bytes": 49478
   },
   {
    "src": "/legacy/members/photos/robcoombssolo.jpg",
    "name": "Robcoombssolo",
    "bytes": 49766
   },
   {
    "src": "/legacy/members/photos/solo_emily%20lockwood_27.5.21.jpg",
    "name": "Solo emily lockwood 27.5.21",
    "bytes": 80318
   },
   {
    "src": "/legacy/members/photos/soloday.gif",
    "name": "Soloday",
    "bytes": 116643
   }
  ]
 },
 {
  "slug": "aircraft-fleet",
  "title": "Aircraft & Fleet",
  "span": "2012",
  "photos": [
   {
    "src": "/legacy/members/photos/20120128%20K18KNM.jpg",
    "name": "K18KNM",
    "bytes": 65714
   },
   {
    "src": "/legacy/members/photos/ASK13%20Coronavirus%20edition.jpg",
    "name": "ASK13 Coronavirus edition",
    "bytes": 53143
   },
   {
    "src": "/legacy/members/photos/AlexGreenRatingwithName.jpg",
    "name": "Alex Green Ratingwith Name",
    "bytes": 23521
   },
   {
    "src": "/legacy/members/photos/AlexOldhamRatingwithName.jpg",
    "name": "Alex Oldham Ratingwith Name",
    "bytes": 24540
   },
   {
    "src": "/legacy/members/photos/CampLane170615A.jpg",
    "name": "Camp Lane170615A",
    "bytes": 84177
   },
   {
    "src": "/legacy/members/photos/CampLane170615B.jpg",
    "name": "Camp Lane170615B",
    "bytes": 70846
   },
   {
    "src": "/legacy/members/photos/CampLane170623.jpg",
    "name": "Camp Lane170623",
    "bytes": 94286
   },
   {
    "src": "/legacy/members/photos/CampLane170629A.JPG",
    "name": "Camp Lane170629A",
    "bytes": 105424
   },
   {
    "src": "/legacy/members/photos/CampLane170629C.JPG",
    "name": "Camp Lane170629C",
    "bytes": 103790
   },
   {
    "src": "/legacy/members/photos/DG500%20HNA%20%28A%29.jpg",
    "name": "DG500 HNA (A)",
    "bytes": 164140
   },
   {
    "src": "/legacy/members/photos/DG500%20HNA%20%28B%29.jpg",
    "name": "DG500 HNA (B)",
    "bytes": 183523
   },
   {
    "src": "/legacy/members/photos/DG500%20HNA%20final%20view-2.jpg",
    "name": "DG500 HNA final view-2",
    "bytes": 1038523
   },
   {
    "src": "/legacy/members/photos/DaveSpenceASW15.jpg",
    "name": "Dave Spence ASW15",
    "bytes": 44416
   },
   {
    "src": "/legacy/members/photos/FXO_Debut.jpg",
    "name": "FXO Debut",
    "bytes": 62168
   },
   {
    "src": "/legacy/members/photos/FXO_FirstFlight.jpg",
    "name": "FXO First Flight",
    "bytes": 80926
   },
   {
    "src": "/legacy/members/photos/FXO_Three%20_Puchs.jpg",
    "name": "FXO Three Puchs",
    "bytes": 72637
   },
   {
    "src": "/legacy/members/photos/GaryL-K8.jpg",
    "name": "Gary L-K8",
    "bytes": 14843
   },
   {
    "src": "/legacy/members/photos/Glider%20G-CJVA%201.jpg",
    "name": "Glider G-CJVA 1",
    "bytes": 15375
   },
   {
    "src": "/legacy/members/photos/K13KRBFus.jpg",
    "name": "K13KRBFus",
    "bytes": 89076
   },
   {
    "src": "/legacy/members/photos/K13KRBWngs.jpg",
    "name": "K13KRBWngs",
    "bytes": 80963
   },
   {
    "src": "/legacy/members/photos/K13Repair.jpg",
    "name": "K13Repair",
    "bytes": 39377
   },
   {
    "src": "/legacy/members/photos/K18%20KNM%20275x180.jpg",
    "name": "K18 KNM 275x180",
    "bytes": 55992
   },
   {
    "src": "/legacy/members/photos/K18KNMReturns.jpg",
    "name": "K18KNMReturns",
    "bytes": 106742
   },
   {
    "src": "/legacy/members/photos/K18recoverycrew.jpg",
    "name": "K18recoverycrew",
    "bytes": 66440
   },
   {
    "src": "/legacy/members/photos/K8BungeeAR.jpg",
    "name": "K8Bungee AR",
    "bytes": 44944
   },
   {
    "src": "/legacy/members/photos/K8JOZCabriolet1.jpg",
    "name": "K8JOZCabriolet1",
    "bytes": 130703
   },
   {
    "src": "/legacy/members/photos/K8JOZCabriolet2.jpg",
    "name": "K8JOZCabriolet2",
    "bytes": 97134
   },
   {
    "src": "/legacy/members/photos/K8JOZCabriolet3.jpg",
    "name": "K8JOZCabriolet3",
    "bytes": 40488
   },
   {
    "src": "/legacy/members/photos/K8Weighing.gif",
    "name": "K8Weighing",
    "bytes": 129125
   },
   {
    "src": "/legacy/members/photos/KNM%20K18%20fus.jpg",
    "name": "KNM K18 fus",
    "bytes": 114036
   },
   {
    "src": "/legacy/members/photos/Puch%20Guide%20Dog.jpg",
    "name": "Puch Guide Dog",
    "bytes": 173593
   },
   {
    "src": "/legacy/members/photos/Puch%20The%20Guide%20Dog.jpg",
    "name": "Puch The Guide Dog",
    "bytes": 97486
   },
   {
    "src": "/legacy/members/photos/Puch%20the%20Puppy.jpg",
    "name": "Puch the Puppy",
    "bytes": 28670
   },
   {
    "src": "/legacy/members/photos/Puch151121.jpg",
    "name": "Puch151121",
    "bytes": 52472
   },
   {
    "src": "/legacy/members/photos/Puch%40HopeSmll.jpg",
    "name": "Puch@Hope Smll",
    "bytes": 32610
   },
   {
    "src": "/legacy/members/photos/PuchGuideDogAug2020.jpg",
    "name": "Puch Guide Dog Aug2020",
    "bytes": 59677
   },
   {
    "src": "/legacy/members/photos/PuchShelter.jpg",
    "name": "Puch Shelter",
    "bytes": 86074
   },
   {
    "src": "/legacy/members/photos/PuchTrlrOver.jpg",
    "name": "Puch Trlr Over",
    "bytes": 41554
   },
   {
    "src": "/legacy/members/photos/PuchaczG-CFXO.jpg",
    "name": "Puchacz G-CFXO",
    "bytes": 64959
   },
   {
    "src": "/legacy/members/photos/StuartMacArthurRatingwithName.jpg",
    "name": "Stuart Mac Arthur Ratingwith Name",
    "bytes": 25363
   }
  ]
 },
 {
  "slug": "wave-flying",
  "title": "Wave Flying",
  "span": "2012 – 2014",
  "photos": [
   {
    "src": "/legacy/members/photos/121107waveJS1.jpg",
    "name": "Wave JS1",
    "bytes": 47019
   },
   {
    "src": "/legacy/members/photos/121107waveJS2.jpg",
    "name": "Wave JS2",
    "bytes": 43611
   },
   {
    "src": "/legacy/members/photos/2012%20feb%2023%20wave.jpg",
    "name": "2012 feb 23 wave",
    "bytes": 39429
   },
   {
    "src": "/legacy/members/photos/20140413_wave.jpg",
    "name": "Wave",
    "bytes": 45555
   },
   {
    "src": "/legacy/members/photos/E%27stlyWave29Ap07.jpg",
    "name": "E'stly Wave29Ap07",
    "bytes": 26965
   },
   {
    "src": "/legacy/members/photos/Wave%20Cloud%20%26%20Cement%20Works.jpg",
    "name": "Wave Cloud & Cement Works",
    "bytes": 39666
   },
   {
    "src": "/legacy/members/photos/Wave%20gap%2C%20Edale.gif",
    "name": "Wave gap, Edale",
    "bytes": 101566
   },
   {
    "src": "/legacy/members/photos/Wave090221Magna.jpg",
    "name": "Wave090221Magna",
    "bytes": 27094
   },
   {
    "src": "/legacy/members/photos/Wave090221SirWllmHll.jpg",
    "name": "Wave090221Sir Wllm Hll",
    "bytes": 22744
   },
   {
    "src": "/legacy/members/photos/Wave090221TlrPrk2.jpg",
    "name": "Wave090221Tlr Prk2",
    "bytes": 24840
   },
   {
    "src": "/legacy/members/photos/Wave090221TrgPnt.jpg",
    "name": "Wave090221Trg Pnt",
    "bytes": 32358
   },
   {
    "src": "/legacy/members/photos/Wave120110.1.jpg",
    "name": "Wave120110.1",
    "bytes": 33463
   },
   {
    "src": "/legacy/members/photos/Wave120110.2.jpg",
    "name": "Wave120110.2",
    "bytes": 37614
   },
   {
    "src": "/legacy/members/photos/Wave130816.jpg",
    "name": "Wave130816",
    "bytes": 42236
   },
   {
    "src": "/legacy/members/photos/Wave170125.jpg",
    "name": "Wave170125",
    "bytes": 75780
   },
   {
    "src": "/legacy/members/photos/Wave170405PG.jpg",
    "name": "Wave170405PG",
    "bytes": 66010
   },
   {
    "src": "/legacy/members/photos/WaveCld090618.1.jpg",
    "name": "Wave Cld090618.1",
    "bytes": 23883
   },
   {
    "src": "/legacy/members/photos/WaveCld090618.2.jpg",
    "name": "Wave Cld090618.2",
    "bytes": 30395
   },
   {
    "src": "/legacy/members/photos/WaveClouds301011.jpg",
    "name": "Wave Clouds301011",
    "bytes": 38229
   },
   {
    "src": "/legacy/members/photos/WaveFlight141003.gif",
    "name": "Wave Flight141003",
    "bytes": 130314
   },
   {
    "src": "/legacy/members/photos/WaveShot170224.jpg",
    "name": "Wave Shot170224",
    "bytes": 45842
   },
   {
    "src": "/legacy/members/photos/WaveShotAlexO181009.jpg",
    "name": "Wave Shot Alex O181009",
    "bytes": 70683
   },
   {
    "src": "/legacy/members/photos/breaking_wave.jpg",
    "name": "Breaking wave",
    "bytes": 32884
   },
   {
    "src": "/legacy/members/photos/wave10-3-07%281%29.jpg",
    "name": "Wave10-3-07(1)",
    "bytes": 38539
   },
   {
    "src": "/legacy/members/photos/wave10-3-07%282%29.jpg",
    "name": "Wave10-3-07(2)",
    "bytes": 38748
   },
   {
    "src": "/legacy/members/photos/wave16-03-07%281%29.jpg",
    "name": "Wave16-03-07(1)",
    "bytes": 25159
   },
   {
    "src": "/legacy/members/photos/wave16-03-07%282%29.jpg",
    "name": "Wave16-03-07(2)",
    "bytes": 31057
   },
   {
    "src": "/legacy/members/photos/wavecloud150618.jpg",
    "name": "Wavecloud150618",
    "bytes": 50524
   },
   {
    "src": "/legacy/members/photos/waveclouds120225.jpg",
    "name": "Waveclouds120225",
    "bytes": 35052
   },
   {
    "src": "/legacy/members/photos/wavedec11.jpg",
    "name": "Wavedec11",
    "bytes": 56586
   }
  ]
 },
 {
  "slug": "snippets",
  "title": "Snippets",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/galleries/snippets/C.%20The%20trophys.jpg",
    "name": "C. The trophys",
    "bytes": 29625
   },
   {
    "src": "/legacy/members/galleries/snippets/CobraTop%20small.png",
    "name": "Cobra Top small",
    "bytes": 252446
   },
   {
    "src": "/legacy/members/galleries/snippets/CobraTop.JPG",
    "name": "Cobra Top",
    "bytes": 9715308
   },
   {
    "src": "/legacy/members/galleries/snippets/G-DLGC%20Rigged.jpg",
    "name": "G-DLGC Rigged",
    "bytes": 214749
   },
   {
    "src": "/legacy/members/galleries/snippets/G-DLGC%20small.jpg",
    "name": "G-DLGC small",
    "bytes": 29351
   },
   {
    "src": "/legacy/members/galleries/snippets/M2.%20The%20Mensforth%20Trophy.jpg",
    "name": "M2. The Mensforth Trophy",
    "bytes": 28136
   },
   {
    "src": "/legacy/members/galleries/snippets/NHT2.jpg",
    "name": "NHT2",
    "bytes": 38602
   },
   {
    "src": "/legacy/members/galleries/snippets/a.%20Eyes%20Down%20Listen%20In.jpg",
    "name": "A. Eyes Down Listen In",
    "bytes": 28975
   },
   {
    "src": "/legacy/members/galleries/snippets/b.%20The%20message.jpg",
    "name": "B. The message",
    "bytes": 34531
   },
   {
    "src": "/legacy/members/galleries/snippets/b1.%20After%203%20we%20will%20sing%20Hymn%20no%203%20on%20your%20song%20sheets.jpg",
    "name": "B1. After 3 we will sing Hymn no 3 on your song sheets",
    "bytes": 19334
   },
   {
    "src": "/legacy/members/galleries/snippets/b2.%20The%20Honorary%20Treasurer%20with%20Halo.jpg",
    "name": "B2. The Honorary Treasurer with Halo",
    "bytes": 21684
   },
   {
    "src": "/legacy/members/galleries/snippets/ca.The%20Nigel%20Howes%20Memorial%20Trophy.jpg",
    "name": "Ca.The Nigel Howes Memorial Trophy",
    "bytes": 20772
   },
   {
    "src": "/legacy/members/galleries/snippets/cb.%20And%20the%20winners%20are%21.jpg",
    "name": "Cb. And the winners are!",
    "bytes": 24012
   },
   {
    "src": "/legacy/members/galleries/snippets/d.%20Our%20guest%20of%20honour%20Acting%20President%20Rob.jpg",
    "name": "D. Our guest of honour Acting President Rob",
    "bytes": 30877
   },
   {
    "src": "/legacy/members/galleries/snippets/da.%20Announcing%20The%20Winners.jpg",
    "name": "Da. Announcing The Winners",
    "bytes": 32761
   },
   {
    "src": "/legacy/members/galleries/snippets/f.%20The%20anniversary%20TRophy.jpg",
    "name": "F. The anniversary TRophy",
    "bytes": 34560
   },
   {
    "src": "/legacy/members/galleries/snippets/g.The%20Chairmans%20prize.jpg",
    "name": "G.The Chairmans prize",
    "bytes": 35960
   },
   {
    "src": "/legacy/members/galleries/snippets/h.The%20Seagers%20Trophy.jpg",
    "name": "H.The Seagers Trophy",
    "bytes": 26983
   },
   {
    "src": "/legacy/members/galleries/snippets/i%20The%20Seager%20trophy%20part.jpg",
    "name": "I The Seager trophy part",
    "bytes": 30116
   },
   {
    "src": "/legacy/members/galleries/snippets/j.%20The%20Meads%20Trophy.jpg",
    "name": "J. The Meads Trophy",
    "bytes": 31909
   },
   {
    "src": "/legacy/members/galleries/snippets/k.%20Peak%20Trophy.jpg",
    "name": "K. Peak Trophy",
    "bytes": 29494
   },
   {
    "src": "/legacy/members/galleries/snippets/m%20The%20Bob%20Frodsham%20Trophy.jpg",
    "name": "M The Bob Frodsham Trophy",
    "bytes": 31384
   },
   {
    "src": "/legacy/members/galleries/snippets/o.%20Ellis%20thanks%20the%20Instructors.jpg",
    "name": "O. Ellis thanks the Instructors",
    "bytes": 24958
   }
  ]
 },
 {
  "slug": "aerial-landscape",
  "title": "Aerial & Landscape",
  "span": "2018",
  "photos": [
   {
    "src": "/legacy/members/photos/180825%20HopeValley.jpg",
    "name": "Hope Valley",
    "bytes": 136116
   },
   {
    "src": "/legacy/members/photos/180825%20Ladybower.jpg",
    "name": "Ladybower",
    "bytes": 127520
   },
   {
    "src": "/legacy/members/photos/CKClouds1.gif",
    "name": "CKClouds1",
    "bytes": 123983
   },
   {
    "src": "/legacy/members/photos/CKClouds2.gif",
    "name": "CKClouds2",
    "bytes": 95088
   },
   {
    "src": "/legacy/members/photos/Cloud140610%281%29.jpg",
    "name": "Cloud140610(1)",
    "bytes": 49319
   },
   {
    "src": "/legacy/members/photos/Cloud140610%282%29.jpg",
    "name": "Cloud140610(2)",
    "bytes": 37266
   },
   {
    "src": "/legacy/members/photos/Cloud169524%20Parsley%20Hay.jpg",
    "name": "Cloud169524 Parsley Hay",
    "bytes": 84088
   },
   {
    "src": "/legacy/members/photos/FrogattEdge.jpg",
    "name": "Frogatt Edge",
    "bytes": 38365
   },
   {
    "src": "/legacy/members/photos/HopeValley.jpg",
    "name": "Hope Valley",
    "bytes": 383318
   },
   {
    "src": "/legacy/members/photos/HopeValley500x375.jpg",
    "name": "Hope Valley500x375",
    "bytes": 39528
   },
   {
    "src": "/legacy/members/photos/Ladybower180510AO.jpg",
    "name": "Ladybower180510AO",
    "bytes": 116226
   },
   {
    "src": "/legacy/members/photos/Ladybower2.jpg",
    "name": "Ladybower2",
    "bytes": 53814
   },
   {
    "src": "/legacy/members/photos/MBWaterOverDerwentDams.jpg",
    "name": "MBWater Over Derwent Dams",
    "bytes": 52780
   },
   {
    "src": "/legacy/members/photos/Over%20Derwent%20Alex.jpg",
    "name": "Over Derwent Alex",
    "bytes": 36172
   },
   {
    "src": "/legacy/members/photos/SfdCloudFly1.jpg",
    "name": "Sfd Cloud Fly1",
    "bytes": 51406
   },
   {
    "src": "/legacy/members/photos/SfdCloudFly4.jpg",
    "name": "Sfd Cloud Fly4",
    "bytes": 62493
   },
   {
    "src": "/legacy/members/photos/VllyFogSthEdge.jpg",
    "name": "Vlly Fog Sth Edge",
    "bytes": 34608
   },
   {
    "src": "/legacy/members/photos/cloud%20street%20mar08.jpg",
    "name": "Cloud street mar08",
    "bytes": 39309
   },
   {
    "src": "/legacy/members/photos/clouds20170406.jpg",
    "name": "Clouds20170406",
    "bytes": 41248
   },
   {
    "src": "/legacy/members/photos/shower%20cloud%20230314.jpg",
    "name": "Shower cloud 230314",
    "bytes": 54652
   },
   {
    "src": "/legacy/members/photos/valleyfog101119.2.jpg",
    "name": "Valleyfog101119.2",
    "bytes": 17544
   }
  ]
 },
 {
  "slug": "club-events-socials",
  "title": "Club Events & Socials",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/AdrianWine.jpg",
    "name": "Adrian Wine",
    "bytes": 102915
   },
   {
    "src": "/legacy/members/photos/AlexWine.jpg",
    "name": "Alex Wine",
    "bytes": 64208
   },
   {
    "src": "/legacy/members/photos/C%20Taylor%20K%20Prknsn%20Award.jpg",
    "name": "C Taylor K Prknsn Award",
    "bytes": 66565
   },
   {
    "src": "/legacy/members/photos/Dave%20Spencer%20Field%20Wine.jpg",
    "name": "Dave Spencer Field Wine",
    "bytes": 19122
   },
   {
    "src": "/legacy/members/photos/Ian%20C%20field%20wine.jpg",
    "name": "Ian C field wine",
    "bytes": 34846
   },
   {
    "src": "/legacy/members/photos/JohnKWine.jpg",
    "name": "John KWine",
    "bytes": 42343
   },
   {
    "src": "/legacy/members/photos/JonWine.jpg",
    "name": "Jon Wine",
    "bytes": 75068
   },
   {
    "src": "/legacy/members/photos/LizMartinPrize.jpg",
    "name": "Liz Martin Prize",
    "bytes": 22448
   },
   {
    "src": "/legacy/members/photos/Lunch2009Med.jpg",
    "name": "Lunch2009Med",
    "bytes": 56761
   },
   {
    "src": "/legacy/members/photos/Martin%20Roberts%20Wine.jpg",
    "name": "Martin Roberts Wine",
    "bytes": 17467
   },
   {
    "src": "/legacy/members/photos/Matin%20Roberts%20Wine%202.jpg",
    "name": "Matin Roberts Wine 2",
    "bytes": 19294
   },
   {
    "src": "/legacy/members/photos/Mike%20A-Wine%20Award.png",
    "name": "Mike A-Wine Award",
    "bytes": 163708
   },
   {
    "src": "/legacy/members/photos/PGwine.jpg",
    "name": "PGwine",
    "bytes": 75030
   },
   {
    "src": "/legacy/members/photos/Reds1.jpg",
    "name": "Reds1",
    "bytes": 32836
   },
   {
    "src": "/legacy/members/photos/Reds2.jpg",
    "name": "Reds2",
    "bytes": 33933
   },
   {
    "src": "/legacy/members/photos/Reds3.jpg",
    "name": "Reds3",
    "bytes": 33336
   },
   {
    "src": "/legacy/members/photos/Reds4.jpg",
    "name": "Reds4",
    "bytes": 29172
   },
   {
    "src": "/legacy/members/photos/TalgarthBBQ.jpg",
    "name": "Talgarth BBQ",
    "bytes": 129213
   },
   {
    "src": "/legacy/members/photos/WarwickWine.jpg",
    "name": "Warwick Wine",
    "bytes": 107691
   },
   {
    "src": "/legacy/members/photos/WineAN.jpg",
    "name": "Wine AN",
    "bytes": 61222
   },
   {
    "src": "/legacy/members/photos/WineGL.jpg",
    "name": "Wine GL",
    "bytes": 69258
   }
  ]
 },
 {
  "slug": "members",
  "title": "Members",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/clip_image002.jpg",
    "name": "Clip image002",
    "bytes": 36320
   },
   {
    "src": "/legacy/members/clip_image004.jpg",
    "name": "Clip image004",
    "bytes": 18506
   },
   {
    "src": "/legacy/members/clip_image006.jpg",
    "name": "Clip image006",
    "bytes": 14132
   },
   {
    "src": "/legacy/members/clip_image008.jpg",
    "name": "Clip image008",
    "bytes": 39489
   },
   {
    "src": "/legacy/members/clip_image010.jpg",
    "name": "Clip image010",
    "bytes": 40306
   },
   {
    "src": "/legacy/members/image001.jpg",
    "name": "Image001",
    "bytes": 78536
   },
   {
    "src": "/legacy/members/img13.jpg",
    "name": "Img13",
    "bytes": 21811
   },
   {
    "src": "/legacy/members/img16.jpg",
    "name": "Img16",
    "bytes": 13947
   },
   {
    "src": "/legacy/members/img17.jpg",
    "name": "Img17",
    "bytes": 15307
   },
   {
    "src": "/legacy/members/img18.jpg",
    "name": "Img18",
    "bytes": 17645
   },
   {
    "src": "/legacy/members/img3.jpg",
    "name": "Img3",
    "bytes": 31398
   },
   {
    "src": "/legacy/members/img4.jpg",
    "name": "Img4",
    "bytes": 39295
   },
   {
    "src": "/legacy/members/img5.jpg",
    "name": "Img5",
    "bytes": 31727
   },
   {
    "src": "/legacy/members/img6.jpg",
    "name": "Img6",
    "bytes": 44197
   },
   {
    "src": "/legacy/members/img7.jpg",
    "name": "Img7",
    "bytes": 31602
   },
   {
    "src": "/legacy/members/imgA.jpg",
    "name": "Img A",
    "bytes": 31011
   },
   {
    "src": "/legacy/members/imgB.jpg",
    "name": "Img B",
    "bytes": 28626
   },
   {
    "src": "/legacy/members/imgC.jpg",
    "name": "Img C",
    "bytes": 21745
   },
   {
    "src": "/legacy/members/imgD.jpg",
    "name": "Img D",
    "bytes": 38207
   },
   {
    "src": "/legacy/members/imgF.jpg",
    "name": "Img F",
    "bytes": 45728
   }
  ]
 },
 {
  "slug": "winch-ground-ops",
  "title": "Winch & Ground Ops",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/HeliWinchLaunch.jpg",
    "name": "Heli Winch Launch",
    "bytes": 44638
   },
   {
    "src": "/legacy/members/photos/Needwood%20winch%201.jpg",
    "name": "Needwood winch 1",
    "bytes": 62435
   },
   {
    "src": "/legacy/members/photos/Needwood%20winch%203.jpg",
    "name": "Needwood winch 3",
    "bytes": 82676
   },
   {
    "src": "/legacy/members/photos/Needwood%20winch%204.jpg",
    "name": "Needwood winch 4",
    "bytes": 57866
   },
   {
    "src": "/legacy/members/photos/Needwood%20winch%205.jpg",
    "name": "Needwood winch 5",
    "bytes": 50901
   },
   {
    "src": "/legacy/members/photos/RckLaunch.jpg",
    "name": "Rck Launch",
    "bytes": 36499
   },
   {
    "src": "/legacy/members/photos/Tractor.jpg",
    "name": "Tractor",
    "bytes": 86623
   },
   {
    "src": "/legacy/members/photos/Tractor2.jpg",
    "name": "Tractor2",
    "bytes": 96786
   },
   {
    "src": "/legacy/members/photos/Tractor3.jpg",
    "name": "Tractor3",
    "bytes": 65453
   },
   {
    "src": "/legacy/members/photos/TractorA.jpg",
    "name": "Tractor A",
    "bytes": 125515
   },
   {
    "src": "/legacy/members/photos/TractorB.jpg",
    "name": "Tractor B",
    "bytes": 92325
   },
   {
    "src": "/legacy/members/photos/Tufty%20last%20launch.jpg",
    "name": "Tufty last launch",
    "bytes": 28394
   },
   {
    "src": "/legacy/members/photos/TwinWinches.jpg",
    "name": "Twin Winches",
    "bytes": 105052
   },
   {
    "src": "/legacy/members/photos/WinchCaveAfter.gif",
    "name": "Winch Cave After",
    "bytes": 119578
   },
   {
    "src": "/legacy/members/photos/WinchCaveBefore.gif",
    "name": "Winch Cave Before",
    "bytes": 136672
   },
   {
    "src": "/legacy/members/photos/WinchCaveGone.gif",
    "name": "Winch Cave Gone",
    "bytes": 129157
   }
  ]
 },
 {
  "slug": "snow-at-camphill",
  "title": "Snow at Camphill",
  "span": "2018",
  "photos": [
   {
    "src": "/legacy/members/photos/180216HangarSnow.jpg",
    "name": "Hangar Snow",
    "bytes": 25436
   },
   {
    "src": "/legacy/members/photos/180301FoolowSnow.jpg",
    "name": "Foolow Snow",
    "bytes": 14101
   },
   {
    "src": "/legacy/members/photos/2012Xmas1.jpg",
    "name": "2012Xmas1",
    "bytes": 122031
   },
   {
    "src": "/legacy/members/photos/2012Xmas2.jpg",
    "name": "2012Xmas2",
    "bytes": 115546
   },
   {
    "src": "/legacy/members/photos/2012Xmas3.jpg",
    "name": "2012Xmas3",
    "bytes": 119740
   },
   {
    "src": "/legacy/members/photos/DLGC%20Snow%20Feb2020.jpg",
    "name": "DLGC Snow Feb2020",
    "bytes": 66222
   },
   {
    "src": "/legacy/members/photos/SnowShower0703.jpg",
    "name": "Snow Shower0703",
    "bytes": 39360
   },
   {
    "src": "/legacy/members/photos/Snowden.jpg",
    "name": "Snowden",
    "bytes": 14895
   },
   {
    "src": "/legacy/members/photos/snow%20rigging%20190317.jpg",
    "name": "Snow rigging 190317",
    "bytes": 82777
   },
   {
    "src": "/legacy/members/photos/snow100117.jpg",
    "name": "Snow100117",
    "bytes": 43614
   },
   {
    "src": "/legacy/members/photos/snow12mar.1.jpg",
    "name": "Snow12mar.1",
    "bytes": 57075
   },
   {
    "src": "/legacy/members/photos/snow12mar.2.jpg",
    "name": "Snow12mar.2",
    "bytes": 42751
   },
   {
    "src": "/legacy/members/photos/snow12mar.3.jpg",
    "name": "Snow12mar.3",
    "bytes": 84274
   },
   {
    "src": "/legacy/members/photos/snow141227_2.jpg",
    "name": "Snow141227 2",
    "bytes": 45699
   }
  ]
 },
 {
  "slug": "buildings-january-2014",
  "title": "Buildings — January 2014",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/BlgdsJan14/DSCN4314.jpg",
    "name": "DSCN4314",
    "bytes": 51476
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/DSCN4315.jpg",
    "name": "DSCN4315",
    "bytes": 53675
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/Hangarleg2.jpg",
    "name": "Hangarleg2",
    "bytes": 95816
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/Panorama%28JS%29.jpg",
    "name": "Panorama(JS)",
    "bytes": 81875
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/S%26W%2001.jpg",
    "name": "S&W 01",
    "bytes": 79967
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/Shed%20Monday%205%20Jan.jpg",
    "name": "Shed Monday 5 Jan",
    "bytes": 79417
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/Terry%2001-1.jpg",
    "name": "Terry 01-1",
    "bytes": 68193
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/hangarleg1.jpg",
    "name": "Hangarleg1",
    "bytes": 52525
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/hangarleg3.jpg",
    "name": "Hangarleg3",
    "bytes": 105968
   },
   {
    "src": "/legacy/members/photos/BlgdsJan14/hangarleg4.jpg",
    "name": "Hangarleg4",
    "bytes": 88141
   }
  ]
 },
 {
  "slug": "corporate-day",
  "title": "Corporate Day",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/corpday/002.jpg",
    "name": "002",
    "bytes": 107774
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6778.jpg",
    "name": "CIMG6778",
    "bytes": 101114
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6783.jpg",
    "name": "CIMG6783",
    "bytes": 92958
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6786.jpg",
    "name": "CIMG6786",
    "bytes": 101016
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6790.jpg",
    "name": "CIMG6790",
    "bytes": 92022
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6792.jpg",
    "name": "CIMG6792",
    "bytes": 92053
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6794.jpg",
    "name": "CIMG6794",
    "bytes": 91176
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6802.jpg",
    "name": "CIMG6802",
    "bytes": 88545
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6803.jpg",
    "name": "CIMG6803",
    "bytes": 85447
   },
   {
    "src": "/legacy/members/photos/corpday/CIMG6804.jpg",
    "name": "CIMG6804",
    "bytes": 91844
   }
  ]
 },
 {
  "slug": "new-winch-drivers",
  "title": "New Winch Drivers",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/winchies/Andy%20Mills%20WD.jpg",
    "name": "Andy Mills WD",
    "bytes": 35771
   },
   {
    "src": "/legacy/members/photos/winchies/Ben%20McIntyre%20WD.jpg",
    "name": "Ben Mc Intyre WD",
    "bytes": 16463
   },
   {
    "src": "/legacy/members/photos/winchies/Brian%20Allen%20WD.jpg",
    "name": "Brian Allen WD",
    "bytes": 15890
   },
   {
    "src": "/legacy/members/photos/winchies/DH%20winch%20photo.jpg",
    "name": "DH winch photo",
    "bytes": 19135
   },
   {
    "src": "/legacy/members/photos/winchies/Jan%20Rush.jpg",
    "name": "Jan Rush",
    "bytes": 15174
   },
   {
    "src": "/legacy/members/photos/winchies/Malcolm%20Blood.jpg",
    "name": "Malcolm Blood",
    "bytes": 46557
   },
   {
    "src": "/legacy/members/photos/winchies/Owen%20Brown%20WD.jpg",
    "name": "Owen Brown WD",
    "bytes": 21944
   },
   {
    "src": "/legacy/members/photos/winchies/Simon%20Stannrd.jpg",
    "name": "Simon Stannrd",
    "bytes": 756976
   },
   {
    "src": "/legacy/members/photos/winchies/Steve%20Pearce%20WD.jpg",
    "name": "Steve Pearce WD",
    "bytes": 24128
   },
   {
    "src": "/legacy/members/photos/winchies/Stuart%20Dennis%20WD.jpg",
    "name": "Stuart Dennis WD",
    "bytes": 14043
   }
  ]
 },
 {
  "slug": "vintage-classic",
  "title": "Vintage & Classic",
  "span": "2018",
  "photos": [
   {
    "src": "/legacy/members/photos/180216T21FirstLnchPrep.jpg",
    "name": "T21First Lnch Prep",
    "bytes": 19779
   },
   {
    "src": "/legacy/members/photos/KirbyKite.jpg",
    "name": "Kirby Kite",
    "bytes": 65054
   },
   {
    "src": "/legacy/members/photos/ShrlyT21.1.jpg",
    "name": "Shrly T21.1",
    "bytes": 87511
   },
   {
    "src": "/legacy/members/photos/ShrlyT21.2.jpg",
    "name": "Shrly T21.2",
    "bytes": 93036
   },
   {
    "src": "/legacy/members/photos/ShrlyT21.3.jpg",
    "name": "Shrly T21.3",
    "bytes": 72938
   },
   {
    "src": "/legacy/members/photos/ShrlyT21.4.jpg",
    "name": "Shrly T21.4",
    "bytes": 77714
   },
   {
    "src": "/legacy/members/photos/T21%20KenHardy%2022.04.21.jpg",
    "name": "T21 Ken Hardy 22.04.21",
    "bytes": 113109
   },
   {
    "src": "/legacy/members/photos/T21_Trailer_Repair_Team.jpg",
    "name": "T21 Trailer Repair Team",
    "bytes": 89699
   },
   {
    "src": "/legacy/members/photos/VintageFleet.jpg",
    "name": "Vintage Fleet",
    "bytes": 80978
   }
  ]
 },
 {
  "slug": "buildings-november-2014",
  "title": "Buildings — November 2014",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0509.jpg",
    "name": "IMG 0509",
    "bytes": 36533
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0513.jpg",
    "name": "IMG 0513",
    "bytes": 47445
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0515.jpg",
    "name": "IMG 0515",
    "bytes": 38924
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0516.jpg",
    "name": "IMG 0516",
    "bytes": 48811
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0517.jpg",
    "name": "IMG 0517",
    "bytes": 39265
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0518.jpg",
    "name": "IMG 0518",
    "bytes": 62994
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0520-1.jpg",
    "name": "IMG 0520-1",
    "bytes": 41645
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0523.jpg",
    "name": "IMG 0523",
    "bytes": 53042
   },
   {
    "src": "/legacy/members/photos/BldgsNov14/IMG_0526.jpg",
    "name": "IMG 0526",
    "bytes": 44256
   }
  ]
 },
 {
  "slug": "john-shipley",
  "title": "John Shipley",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/JShipley/P1030755a.jpg",
    "name": "P1030755a",
    "bytes": 50276
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030756a.jpg",
    "name": "P1030756a",
    "bytes": 63146
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030771a.jpg",
    "name": "P1030771a",
    "bytes": 63549
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030774a.jpg",
    "name": "P1030774a",
    "bytes": 57974
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030918a%20Froggatt%20Edge.jpg",
    "name": "P1030918a Froggatt Edge",
    "bytes": 54723
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030923a%20Derwent%20%26%20Hope%20Valleys.jpg",
    "name": "P1030923a Derwent & Hope Valleys",
    "bytes": 55014
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030953a%20Ladybower%20Reservoir.jpg",
    "name": "P1030953a Ladybower Reservoir",
    "bytes": 54087
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030962a%20Mam%20Tor.jpg",
    "name": "P1030962a Mam Tor",
    "bytes": 60905
   },
   {
    "src": "/legacy/members/photos/JShipley/P1030980a%20Ladybower.jpg",
    "name": "P1030980a Ladybower",
    "bytes": 53325
   }
  ]
 },
 {
  "slug": "senior-members-lunch",
  "title": "Senior Members Lunch",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5026.jpg",
    "name": "CIMG5026",
    "bytes": 232344
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5027.jpg",
    "name": "CIMG5027",
    "bytes": 246819
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5029.jpg",
    "name": "CIMG5029",
    "bytes": 117922
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5032.jpg",
    "name": "CIMG5032",
    "bytes": 111833
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5034.jpg",
    "name": "CIMG5034",
    "bytes": 109221
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5036.jpg",
    "name": "CIMG5036",
    "bytes": 113315
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5042.jpg",
    "name": "CIMG5042",
    "bytes": 103086
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5043.jpg",
    "name": "CIMG5043",
    "bytes": 103293
   },
   {
    "src": "/legacy/members/photos/SnrMembsLnch/CIMG5044.jpg",
    "name": "CIMG5044",
    "bytes": 114301
   }
  ]
 },
 {
  "slug": "work-parties-repairs",
  "title": "Work Parties & Repairs",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/CamphillLaneRepair1.jpg",
    "name": "Camphill Lane Repair1",
    "bytes": 103986
   },
   {
    "src": "/legacy/members/photos/CamphillLaneRepair2.jpg",
    "name": "Camphill Lane Repair2",
    "bytes": 67197
   },
   {
    "src": "/legacy/members/photos/CamphillLaneRepair3.jpg",
    "name": "Camphill Lane Repair3",
    "bytes": 116817
   },
   {
    "src": "/legacy/members/photos/CamphillLaneRepair4.jpg",
    "name": "Camphill Lane Repair4",
    "bytes": 85693
   },
   {
    "src": "/legacy/members/photos/HangarFix.jpg",
    "name": "Hangar Fix",
    "bytes": 58010
   },
   {
    "src": "/legacy/members/photos/HangarMolehill.jpg",
    "name": "Hangar Molehill",
    "bytes": 42061
   },
   {
    "src": "/legacy/members/photos/JRJ_Repaired_171203.jpg",
    "name": "JRJ Repaired 171203",
    "bytes": 16503
   },
   {
    "src": "/legacy/members/photos/KRB_In_T_Hangar.jpg",
    "name": "KRB In T Hangar",
    "bytes": 128348
   }
  ]
 },
 {
  "slug": "snow-january-2010",
  "title": "Snow — January 2010",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow030110/DngRm.jpg",
    "name": "Dng Rm",
    "bytes": 112605
   },
   {
    "src": "/legacy/members/photos/snow030110/FrmSth.jpg",
    "name": "Frm Sth",
    "bytes": 50207
   },
   {
    "src": "/legacy/members/photos/snow030110/HrPin.jpg",
    "name": "Hr Pin",
    "bytes": 86924
   },
   {
    "src": "/legacy/members/photos/snow030110/Layby.jpg",
    "name": "Layby",
    "bytes": 85936
   },
   {
    "src": "/legacy/members/photos/snow030110/ThBend.jpg",
    "name": "Th Bend",
    "bytes": 115535
   },
   {
    "src": "/legacy/members/photos/snow030110/TrlsLn.jpg",
    "name": "Trls Ln",
    "bytes": 56354
   },
   {
    "src": "/legacy/members/photos/snow030110/TrlsPrk.jpg",
    "name": "Trls Prk",
    "bytes": 95394
   },
   {
    "src": "/legacy/members/photos/snow030110/VntTrl.jpg",
    "name": "Vnt Trl",
    "bytes": 82297
   }
  ]
 },
 {
  "slug": "snow-2009",
  "title": "Snow — 2009",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow2009/P2030182-.jpg",
    "name": "P2030182",
    "bytes": 50818
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030184-.jpg",
    "name": "P2030184",
    "bytes": 20100
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030188-.jpg",
    "name": "P2030188",
    "bytes": 21907
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030194-.jpg",
    "name": "P2030194",
    "bytes": 42852
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030198-.jpg",
    "name": "P2030198",
    "bytes": 40739
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030199-.jpg",
    "name": "P2030199",
    "bytes": 23743
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030213-.jpg",
    "name": "P2030213",
    "bytes": 41187
   },
   {
    "src": "/legacy/members/photos/snow2009/P2030214-.jpg",
    "name": "P2030214",
    "bytes": 43925
   }
  ]
 },
 {
  "slug": "dlgcaboyne2016",
  "title": "Dlgcaboyne2016",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/A%20street%20to%20the%20west.jpg",
    "name": "A street to the west",
    "bytes": 57955
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/AndrewHsoup.jpg",
    "name": "Andrew Hsoup",
    "bytes": 48117
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/Cleanplates.jpg",
    "name": "Cleanplates",
    "bytes": 62934
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/EltonJohn.jpg",
    "name": "Elton John",
    "bytes": 60181
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/JohnHnearBallater.jpg",
    "name": "John Hnear Ballater",
    "bytes": 62814
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/PeterMbeefWellington.jpg",
    "name": "Peter Mbeef Wellington",
    "bytes": 55546
   },
   {
    "src": "/legacy/members/photos/DLGCAboyne2016/PeterMylettdescending.jpg",
    "name": "Peter Mylettdescending",
    "bytes": 55369
   }
  ]
 },
 {
  "slug": "mapics",
  "title": "Mapics",
  "span": "2012",
  "photos": [
   {
    "src": "/legacy/members/photos/MAPics/14Feb12DamsIce.jpg",
    "name": "Dams Ice",
    "bytes": 90801
   },
   {
    "src": "/legacy/members/photos/MAPics/14Feb12Edale.jpg",
    "name": "Edale",
    "bytes": 34819
   },
   {
    "src": "/legacy/members/photos/MAPics/25Feb12Dams.jpg",
    "name": "Dams",
    "bytes": 48583
   },
   {
    "src": "/legacy/members/photos/MAPics/25Feb12Sheffield.jpg",
    "name": "Sheffield",
    "bytes": 47768
   },
   {
    "src": "/legacy/members/photos/MAPics/DSCN2314%283%29.jpg",
    "name": "DSCN2314(3)",
    "bytes": 55896
   },
   {
    "src": "/legacy/members/photos/MAPics/DSCN2318%282%29.jpg",
    "name": "DSCN2318(2)",
    "bytes": 61440
   },
   {
    "src": "/legacy/members/photos/MAPics/DSCN2321%282%29.jpg",
    "name": "DSCN2321(2)",
    "bytes": 72204
   }
  ]
 },
 {
  "slug": "photos-2feb19",
  "title": "Photos 2Feb19",
  "span": "2019",
  "photos": [
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Snow1.jpg",
    "name": "Snow1",
    "bytes": 77976
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Snow2.jpg",
    "name": "Snow2",
    "bytes": 132069
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Wrkshp1.jpg",
    "name": "Wrkshp1",
    "bytes": 105306
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Wrkshp2.jpg",
    "name": "Wrkshp2",
    "bytes": 89280
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Wrkshp3.jpg",
    "name": "Wrkshp3",
    "bytes": 85576
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Wrkshp4.jpg",
    "name": "Wrkshp4",
    "bytes": 98201
   },
   {
    "src": "/legacy/members/photos/Photos%202Feb19/20190202Wrkshp5.jpg",
    "name": "Wrkshp5",
    "bytes": 64158
   }
  ]
 },
 {
  "slug": "model-aircraft",
  "title": "Model Aircraft",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/models1/Ash26%20%281%29.jpg",
    "name": "Ash26 (1)",
    "bytes": 73928
   },
   {
    "src": "/legacy/members/photos/models1/Harbinger.jpg",
    "name": "Harbinger",
    "bytes": 89244
   },
   {
    "src": "/legacy/members/photos/models1/Ka8.jpg",
    "name": "Ka8",
    "bytes": 35684
   },
   {
    "src": "/legacy/members/photos/models1/KiteGrunau1%20%281%29.jpg",
    "name": "Kite Grunau1 (1)",
    "bytes": 50670
   },
   {
    "src": "/legacy/members/photos/models1/KiteOverCamphill.jpg",
    "name": "Kite Over Camphill",
    "bytes": 27397
   },
   {
    "src": "/legacy/members/photos/models1/T21aerotow.jpg",
    "name": "T21aerotow",
    "bytes": 25088
   },
   {
    "src": "/legacy/members/photos/models1/Ventus2c.jpg",
    "name": "Ventus2c",
    "bytes": 80042
   }
  ]
 },
 {
  "slug": "snow-march-2013",
  "title": "Snow — March 2013",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow2013mar/DSCN3194.JPG",
    "name": "DSCN3194",
    "bytes": 104529
   },
   {
    "src": "/legacy/members/photos/snow2013mar/DSCN3198.JPG",
    "name": "DSCN3198",
    "bytes": 115222
   },
   {
    "src": "/legacy/members/photos/snow2013mar/DSCN3199.JPG",
    "name": "DSCN3199",
    "bytes": 86257
   },
   {
    "src": "/legacy/members/photos/snow2013mar/DSCN3200.JPG",
    "name": "DSCN3200",
    "bytes": 90816
   },
   {
    "src": "/legacy/members/photos/snow2013mar/DSCN3202.JPG",
    "name": "DSCN3202",
    "bytes": 108301
   },
   {
    "src": "/legacy/members/photos/snow2013mar/West%20Edge%201.JPG",
    "name": "West Edge 1",
    "bytes": 167780
   },
   {
    "src": "/legacy/members/photos/snow2013mar/West%20Edge2.JPG",
    "name": "West Edge2",
    "bytes": 177717
   }
  ]
 },
 {
  "slug": "itv-day",
  "title": "Itv-Day",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/ITV-Day/Drone%26KHW.jpg",
    "name": "Drone&KHW",
    "bytes": 41380
   },
   {
    "src": "/legacy/members/photos/ITV-Day/PH%20Strap%20in.jpg",
    "name": "PH Strap in",
    "bytes": 60301
   },
   {
    "src": "/legacy/members/photos/ITV-Day/PH%20and%20Chris.jpg",
    "name": "PH and Chris",
    "bytes": 38623
   },
   {
    "src": "/legacy/members/photos/ITV-Day/Parachutes%20aboard.jpg",
    "name": "Parachutes aboard",
    "bytes": 81061
   },
   {
    "src": "/legacy/members/photos/ITV-Day/Ruth%20Gray%20Director.jpg",
    "name": "Ruth Gray Director",
    "bytes": 71214
   },
   {
    "src": "/legacy/members/photos/ITV-Day/We%20are%20off.jpg",
    "name": "We are off",
    "bytes": 48367
   }
  ]
 },
 {
  "slug": "ma-pics",
  "title": "Ma Pics",
  "span": "2007",
  "photos": [
   {
    "src": "/legacy/members/photos/MA%20Pics/070901%20Edale.JPG",
    "name": "Edale",
    "bytes": 14287
   },
   {
    "src": "/legacy/members/photos/MA%20Pics/070901%20Sheffield.jpg",
    "name": "Sheffield",
    "bytes": 17244
   },
   {
    "src": "/legacy/members/photos/MA%20Pics/070910%20looking%20N.JPG",
    "name": "Looking N",
    "bytes": 15934
   },
   {
    "src": "/legacy/members/photos/MA%20Pics/071018%20Windfarm1.JPG",
    "name": "Windfarm1",
    "bytes": 22326
   },
   {
    "src": "/legacy/members/photos/MA%20Pics/DamsOFlow.JPG",
    "name": "Dams OFlow",
    "bytes": 22182
   },
   {
    "src": "/legacy/members/photos/MA%20Pics/KinderDnFl.JPG",
    "name": "Kinder Dn Fl",
    "bytes": 25995
   }
  ]
 },
 {
  "slug": "snow2015jan",
  "title": "Snow2015Jan",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/Snow2015Jan/BungeeGates.jpg",
    "name": "Bungee Gates",
    "bytes": 36399
   },
   {
    "src": "/legacy/members/photos/Snow2015Jan/CamphillStone.jpg",
    "name": "Camphill Stone",
    "bytes": 59171
   },
   {
    "src": "/legacy/members/photos/Snow2015Jan/Hangar2.jpg",
    "name": "Hangar2",
    "bytes": 62763
   },
   {
    "src": "/legacy/members/photos/Snow2015Jan/HangarFromSE.JPG",
    "name": "Hangar From SE",
    "bytes": 111303
   },
   {
    "src": "/legacy/members/photos/Snow2015Jan/NendTree.jpg",
    "name": "Nend Tree",
    "bytes": 50581
   },
   {
    "src": "/legacy/members/photos/Snow2015Jan/TreesNW.jpg",
    "name": "Trees NW",
    "bytes": 117521
   }
  ]
 },
 {
  "slug": "snow080110",
  "title": "Snow080110",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow080110/P1080056.jpg",
    "name": "P1080056",
    "bytes": 73635
   },
   {
    "src": "/legacy/members/photos/snow080110/P1080071.jpg",
    "name": "P1080071",
    "bytes": 60083
   },
   {
    "src": "/legacy/members/photos/snow080110/P1080140.jpg",
    "name": "P1080140",
    "bytes": 81411
   },
   {
    "src": "/legacy/members/photos/snow080110/P1080142.jpg",
    "name": "P1080142",
    "bytes": 86890
   },
   {
    "src": "/legacy/members/photos/snow080110/P1080145.jpg",
    "name": "P1080145",
    "bytes": 66141
   },
   {
    "src": "/legacy/members/photos/snow080110/P1080146.jpg",
    "name": "P1080146",
    "bytes": 51451
   }
  ]
 },
 {
  "slug": "snowjan10",
  "title": "Snowjan10",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0088.jpg",
    "name": "IMG 0088",
    "bytes": 51833
   },
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0115.jpg",
    "name": "IMG 0115",
    "bytes": 30269
   },
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0124.jpg",
    "name": "IMG 0124",
    "bytes": 34233
   },
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0133.jpg",
    "name": "IMG 0133",
    "bytes": 12721
   },
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0142.jpg",
    "name": "IMG 0142",
    "bytes": 19321
   },
   {
    "src": "/legacy/members/photos/snowJan10/IMG_0152.jpg",
    "name": "IMG 0152",
    "bytes": 13918
   }
  ]
 },
 {
  "slug": "150118",
  "title": "150118",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/150118/Cloud%20over%20Camphills.jpg",
    "name": "Cloud over Camphills",
    "bytes": 103597
   },
   {
    "src": "/legacy/members/photos/150118/Cloud%20to%20the%20NEs.jpg",
    "name": "Cloud to the NEs",
    "bytes": 28563
   },
   {
    "src": "/legacy/members/photos/150118/Cloud%20to%20the%20Ws.jpg",
    "name": "Cloud to the Ws",
    "bytes": 38217
   },
   {
    "src": "/legacy/members/photos/150118/Looking%20Ns.jpg",
    "name": "Looking Ns",
    "bytes": 30265
   },
   {
    "src": "/legacy/members/photos/150118/Tideswell%20in%20the%20snows.jpg",
    "name": "Tideswell in the snows",
    "bytes": 34397
   }
  ]
 },
 {
  "slug": "camphill-2010",
  "title": "Camphill — 2010",
  "span": "2010",
  "photos": [
   {
    "src": "/legacy/members/photos/20101205_19.jpg",
    "name": "19",
    "bytes": 51535
   },
   {
    "src": "/legacy/members/photos/20101205_23.jpg",
    "name": "23",
    "bytes": 63649
   },
   {
    "src": "/legacy/members/photos/20101205_30.jpg",
    "name": "30",
    "bytes": 44283
   },
   {
    "src": "/legacy/members/photos/20101205_37.jpg",
    "name": "37",
    "bytes": 63550
   },
   {
    "src": "/legacy/members/photos/20101205_44.jpg",
    "name": "44",
    "bytes": 77425
   }
  ]
 },
 {
  "slug": "70snite",
  "title": "70Snite",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/70sNite/70%27s.6.jpg",
    "name": "70's.6",
    "bytes": 52014
   },
   {
    "src": "/legacy/members/photos/70sNite/70s%20party%20022-.jpg",
    "name": "70s party 022",
    "bytes": 54948
   },
   {
    "src": "/legacy/members/photos/70sNite/70s%20party%20025-.jpg",
    "name": "70s party 025",
    "bytes": 61672
   },
   {
    "src": "/legacy/members/photos/70sNite/70s%20party%20027-.jpg",
    "name": "70s party 027",
    "bytes": 70923
   },
   {
    "src": "/legacy/members/photos/70sNite/70s.7.jpg",
    "name": "70s.7",
    "bytes": 64210
   }
  ]
 },
 {
  "slug": "camplane170801",
  "title": "Camplane170801",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/CampLane170801/DSCF2434b.jpg",
    "name": "DSCF2434b",
    "bytes": 45391
   },
   {
    "src": "/legacy/members/photos/CampLane170801/DSCF2436b.jpg",
    "name": "DSCF2436b",
    "bytes": 47183
   },
   {
    "src": "/legacy/members/photos/CampLane170801/DSCF2439b.jpg",
    "name": "DSCF2439b",
    "bytes": 57932
   },
   {
    "src": "/legacy/members/photos/CampLane170801/DSCF2442b.jpg",
    "name": "DSCF2442b",
    "bytes": 44213
   },
   {
    "src": "/legacy/members/photos/CampLane170801/DSCF2445b.jpg",
    "name": "DSCF2445b",
    "bytes": 55474
   }
  ]
 },
 {
  "slug": "camplanepics170817",
  "title": "Camplanepics170817",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/CampLanePics170817/General%20view%20from%20west%20by%20old%20%20%20quarry-.jpg",
    "name": "General view from west by old quarry",
    "bytes": 74820
   },
   {
    "src": "/legacy/members/photos/CampLanePics170817/east%20%20view%20showing%20%20new%20wall-.jpg",
    "name": "East view showing new wall",
    "bytes": 68450
   },
   {
    "src": "/legacy/members/photos/CampLanePics170817/west%20end%20awaitin%20cappings-.jpg",
    "name": "West end awaitin cappings",
    "bytes": 75387
   },
   {
    "src": "/legacy/members/photos/CampLanePics170817/west%20view%20showing%20height%20of%20new%20%20wall-.jpg",
    "name": "West view showing height of new wall",
    "bytes": 69661
   },
   {
    "src": "/legacy/members/photos/CampLanePics170817/west%20view%20showing%20nw%20support%20wall-.jpg",
    "name": "West view showing nw support wall",
    "bytes": 69615
   }
  ]
 },
 {
  "slug": "krbflies",
  "title": "Krbflies",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/KRBFlies/FirstLaunch.jpg",
    "name": "First Launch",
    "bytes": 60977
   },
   {
    "src": "/legacy/members/photos/KRBFlies/Image094.jpg",
    "name": "Image094",
    "bytes": 56662
   },
   {
    "src": "/legacy/members/photos/KRBFlies/P1030102.jpg",
    "name": "P1030102",
    "bytes": 16543
   },
   {
    "src": "/legacy/members/photos/KRBFlies/P1030103.jpg",
    "name": "P1030103",
    "bytes": 43184
   },
   {
    "src": "/legacy/members/photos/KRBFlies/guess%20who%20is%20flying%20again.jpg",
    "name": "Guess who is flying again",
    "bytes": 58555
   }
  ]
 },
 {
  "slug": "owls",
  "title": "Owls",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/Owls/Owls1.jpg",
    "name": "Owls1",
    "bytes": 73818
   },
   {
    "src": "/legacy/members/photos/Owls/Owls2.jpg",
    "name": "Owls2",
    "bytes": 54951
   },
   {
    "src": "/legacy/members/photos/Owls/Owls3.jpg",
    "name": "Owls3",
    "bytes": 49642
   },
   {
    "src": "/legacy/members/photos/Owls/Owls4.jpg",
    "name": "Owls4",
    "bytes": 54867
   },
   {
    "src": "/legacy/members/photos/Owls/Owls5.jpg",
    "name": "Owls5",
    "bytes": 58855
   }
  ]
 },
 {
  "slug": "s-92",
  "title": "S-92",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/S-92/Helicopter%201R.jpg",
    "name": "Helicopter 1R",
    "bytes": 58324
   },
   {
    "src": "/legacy/members/photos/S-92/Helicopter%202%20Bob%20Liz%20briefingR.jpg",
    "name": "Helicopter 2 Bob Liz briefing R",
    "bytes": 67615
   },
   {
    "src": "/legacy/members/photos/S-92/Helicopter%202%20Roger%20and%20Liz%20Forsyth%20R.jpg",
    "name": "Helicopter 2 Roger and Liz Forsyth R",
    "bytes": 65527
   },
   {
    "src": "/legacy/members/photos/S-92/Helicopter%2023%20inside%20Roger%20and%20Liz%20Forsyth%20R.jpg",
    "name": "Helicopter 23 inside Roger and Liz Forsyth R",
    "bytes": 61575
   },
   {
    "src": "/legacy/members/photos/S-92/Helicopter%20InsideR.jpg",
    "name": "Helicopter Inside R",
    "bytes": 65902
   }
  ]
 },
 {
  "slug": "eden",
  "title": "Eden",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/eden/DerwentSkiddaw.jpg",
    "name": "Derwent Skiddaw",
    "bytes": 40776
   },
   {
    "src": "/legacy/members/photos/eden/RidgeToN.jpg",
    "name": "Ridge To N",
    "bytes": 24158
   },
   {
    "src": "/legacy/members/photos/eden/SkellingWave.jpg",
    "name": "Skelling Wave",
    "bytes": 28026
   },
   {
    "src": "/legacy/members/photos/eden/Skiddaw.jpg",
    "name": "Skiddaw",
    "bytes": 39049
   },
   {
    "src": "/legacy/members/photos/eden/WaveFromAbove.jpg",
    "name": "Wave From Above",
    "bytes": 25903
   }
  ]
 },
 {
  "slug": "ridgescircuuit",
  "title": "Ridgescircuuit",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/ridgescircuuit/02%20Grindleford%20slope.jpg",
    "name": "02 Grindleford slope",
    "bytes": 38429
   },
   {
    "src": "/legacy/members/photos/ridgescircuuit/03%20Millstone%20Edge%20Hathersage%20Moor%20%26%20Stannage.jpg",
    "name": "03 Millstone Edge Hathersage Moor & Stannage",
    "bytes": 41786
   },
   {
    "src": "/legacy/members/photos/ridgescircuuit/04%20Stannage%20Edge%201.jpg",
    "name": "04 Stannage Edge 1",
    "bytes": 36765
   },
   {
    "src": "/legacy/members/photos/ridgescircuuit/05%20Ladybower%20Dam.jpg",
    "name": "05 Ladybower Dam",
    "bytes": 28511
   },
   {
    "src": "/legacy/members/photos/ridgescircuuit/19%20Bamford%20Edge.jpg",
    "name": "19 Bamford Edge",
    "bytes": 50023
   }
  ]
 },
 {
  "slug": "snow060110",
  "title": "Snow060110",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow060110/Johns%20Snow%20jan8th%20001.jpg",
    "name": "Johns Snow jan8th 001",
    "bytes": 39789
   },
   {
    "src": "/legacy/members/photos/snow060110/Johns%20Snow%20jan8th%20002.jpg",
    "name": "Johns Snow jan8th 002",
    "bytes": 55299
   },
   {
    "src": "/legacy/members/photos/snow060110/Johns%20Snow%20jan8th%20003.jpg",
    "name": "Johns Snow jan8th 003",
    "bytes": 34187
   },
   {
    "src": "/legacy/members/photos/snow060110/Johns%20Snow%20jan8th%20004.jpg",
    "name": "Johns Snow jan8th 004",
    "bytes": 38841
   },
   {
    "src": "/legacy/members/photos/snow060110/Johns%20Snow%20jan8th%20005.jpg",
    "name": "Johns Snow jan8th 005",
    "bytes": 42938
   }
  ]
 },
 {
  "slug": "camphill-2012",
  "title": "Camphill — 2012",
  "span": "2012",
  "photos": [
   {
    "src": "/legacy/members/photos/120211.jpg",
    "name": "Photograph",
    "bytes": 191252
   },
   {
    "src": "/legacy/members/photos/121107JSsatpic.jpg",
    "name": "JSsatpic",
    "bytes": 112450
   },
   {
    "src": "/legacy/members/photos/121208A.jpg",
    "name": "A",
    "bytes": 54630
   },
   {
    "src": "/legacy/members/photos/121208B.jpg",
    "name": "B",
    "bytes": 72706
   }
  ]
 },
 {
  "slug": "camphill-2019",
  "title": "Camphill — 2019",
  "span": "2019",
  "photos": [
   {
    "src": "/legacy/members/photos/20190830A.jpg",
    "name": "A",
    "bytes": 30978
   },
   {
    "src": "/legacy/members/photos/20190830B.jpg",
    "name": "B",
    "bytes": 31727
   },
   {
    "src": "/legacy/members/photos/20190830C.jpg",
    "name": "C",
    "bytes": 31681
   },
   {
    "src": "/legacy/members/photos/20190830D.jpg",
    "name": "D",
    "bytes": 39317
   }
  ]
 },
 {
  "slug": "4jan2015",
  "title": "4Jan2015",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/4Jan2015/ASK%208.jpg",
    "name": "ASK 8",
    "bytes": 24142
   },
   {
    "src": "/legacy/members/photos/4Jan2015/At%20the%20top.jpg",
    "name": "At the top",
    "bytes": 16921
   },
   {
    "src": "/legacy/members/photos/4Jan2015/Into%20wind.jpg",
    "name": "Into wind",
    "bytes": 22996
   },
   {
    "src": "/legacy/members/photos/4Jan2015/Puchacz%20Launch.jpg",
    "name": "Puchacz Launch",
    "bytes": 34412
   }
  ]
 },
 {
  "slug": "fibreproject",
  "title": "Fibreproject",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/FibreProject/BuryingCableWithSand.jpg",
    "name": "Burying Cable With Sand",
    "bytes": 52311
   },
   {
    "src": "/legacy/members/photos/FibreProject/MarkingCable%26BackFilling%20.jpg",
    "name": "Marking Cable&Back Filling",
    "bytes": 55313
   },
   {
    "src": "/legacy/members/photos/FibreProject/NearlyDeepEnough.jpg",
    "name": "Nearly Deep Enough",
    "bytes": 43689
   },
   {
    "src": "/legacy/members/photos/FibreProject/UnderThePath.jpg",
    "name": "Under The Path",
    "bytes": 43331
   }
  ]
 },
 {
  "slug": "krb-refurb",
  "title": "Krb Refurb",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/KRB_Refurb/K13Camphill111229%20001.jpg",
    "name": "K13Camphill111229 001",
    "bytes": 66566
   },
   {
    "src": "/legacy/members/photos/KRB_Refurb/K13Camphill111229%20006.jpg",
    "name": "K13Camphill111229 006",
    "bytes": 60875
   },
   {
    "src": "/legacy/members/photos/KRB_Refurb/K13Camphill111229%20009.jpg",
    "name": "K13Camphill111229 009",
    "bytes": 72616
   },
   {
    "src": "/legacy/members/photos/KRB_Refurb/K13Camphill111229%20011.jpg",
    "name": "K13Camphill111229 011",
    "bytes": 62386
   }
  ]
 },
 {
  "slug": "lngdy2017",
  "title": "Lngdy2017",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/LngDy2017/4C2A6623.jpg",
    "name": "4C2A6623",
    "bytes": 43543
   },
   {
    "src": "/legacy/members/photos/LngDy2017/4C2A6665.jpg",
    "name": "4C2A6665",
    "bytes": 64372
   },
   {
    "src": "/legacy/members/photos/LngDy2017/4C2A6689.jpg",
    "name": "4C2A6689",
    "bytes": 35898
   },
   {
    "src": "/legacy/members/photos/LngDy2017/4C2A6695.jpg",
    "name": "4C2A6695",
    "bytes": 46157
   }
  ]
 },
 {
  "slug": "mike-armstrong-collection",
  "title": "Mike Armstrong Collection",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/MApics2/IMGP6562.jpg",
    "name": "IMGP6562",
    "bytes": 13956
   },
   {
    "src": "/legacy/members/photos/MApics2/IMGP6566.jpg",
    "name": "IMGP6566",
    "bytes": 12816
   },
   {
    "src": "/legacy/members/photos/MApics2/IMGP6572.jpg",
    "name": "IMGP6572",
    "bytes": 14083
   },
   {
    "src": "/legacy/members/photos/MApics2/IMGP6576.jpg",
    "name": "IMGP6576",
    "bytes": 15408
   }
  ]
 },
 {
  "slug": "nnite2009",
  "title": "Nnite2009",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/NNite2009/IMG_1789-.jpg",
    "name": "IMG 1789",
    "bytes": 40820
   },
   {
    "src": "/legacy/members/photos/NNite2009/IMG_1792-.jpg",
    "name": "IMG 1792",
    "bytes": 42405
   },
   {
    "src": "/legacy/members/photos/NNite2009/IMG_1796-.jpg",
    "name": "IMG 1796",
    "bytes": 38127
   },
   {
    "src": "/legacy/members/photos/NNite2009/IMG_1801-.jpg",
    "name": "IMG 1801",
    "bytes": 44991
   }
  ]
 },
 {
  "slug": "nghbrsnite2011",
  "title": "Nghbrsnite2011",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/NghbrsNite2011/IMG_0161.jpg",
    "name": "IMG 0161",
    "bytes": 72301
   },
   {
    "src": "/legacy/members/photos/NghbrsNite2011/IMG_0172.jpg",
    "name": "IMG 0172",
    "bytes": 64000
   },
   {
    "src": "/legacy/members/photos/NghbrsNite2011/IMG_0184a.jpg",
    "name": "IMG 0184a",
    "bytes": 58765
   },
   {
    "src": "/legacy/members/photos/NghbrsNite2011/IMG_0196a.jpg",
    "name": "IMG 0196a",
    "bytes": 66803
   }
  ]
 },
 {
  "slug": "nghsnite",
  "title": "Nghsnite",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/NghsNite/IMG_2705.jpg",
    "name": "IMG 2705",
    "bytes": 63915
   },
   {
    "src": "/legacy/members/photos/NghsNite/IMG_2707.jpg",
    "name": "IMG 2707",
    "bytes": 61076
   },
   {
    "src": "/legacy/members/photos/NghsNite/IMG_2708.jpg",
    "name": "IMG 2708",
    "bytes": 72442
   },
   {
    "src": "/legacy/members/photos/NghsNite/IMG_2710.jpg",
    "name": "IMG 2710",
    "bytes": 61498
   }
  ]
 },
 {
  "slug": "rf100km",
  "title": "Rf100Km",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/RF100Km/Barnsley_South.jpg",
    "name": "Barnsley South",
    "bytes": 64243
   },
   {
    "src": "/legacy/members/photos/RF100Km/Chatsworth.jpg",
    "name": "Chatsworth",
    "bytes": 62049
   },
   {
    "src": "/legacy/members/photos/RF100Km/Sheffield_airport.jpg",
    "name": "Sheffield airport",
    "bytes": 68571
   },
   {
    "src": "/legacy/members/photos/RF100Km/Shirebrook.jpg",
    "name": "Shirebrook",
    "bytes": 68826
   }
  ]
 },
 {
  "slug": "buzzards",
  "title": "Buzzards",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/buzzards/P1030107%20-%20undercarriage%20down%20for%20thermalling.jpg",
    "name": "P1030107 - undercarriage down for thermalling",
    "bytes": 30765
   },
   {
    "src": "/legacy/members/photos/buzzards/P1030110%20swing%20wings%20set%20for%20gliding%20at%2050Kts.jpg",
    "name": "P1030110 swing wings set for gliding at 50Kts",
    "bytes": 33409
   },
   {
    "src": "/legacy/members/photos/buzzards/P1030232%20manoeuvring.jpg",
    "name": "P1030232 manoeuvring",
    "bytes": 23672
   },
   {
    "src": "/legacy/members/photos/buzzards/P1030233%20soaring.jpg",
    "name": "P1030233 soaring",
    "bytes": 21789
   }
  ]
 },
 {
  "slug": "matlocko-r",
  "title": "Matlocko-R",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/matlockO-R/P1010170%20Rowsley.jpg",
    "name": "P1010170 Rowsley",
    "bytes": 50152
   },
   {
    "src": "/legacy/members/photos/matlockO-R/P1010177%20going%20to%20Matlock.jpg",
    "name": "P1010177 going to Matlock",
    "bytes": 61407
   },
   {
    "src": "/legacy/members/photos/matlockO-R/P1010183%20Matlock.jpg",
    "name": "P1010183 Matlock",
    "bytes": 92248
   },
   {
    "src": "/legacy/members/photos/matlockO-R/P1010189%20Rowsley.jpg",
    "name": "P1010189 Rowsley",
    "bytes": 33781
   }
  ]
 },
 {
  "slug": "shipleyaeros",
  "title": "Shipleyaeros",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/shipleyaeros/edale.jpg",
    "name": "Edale",
    "bytes": 51800
   },
   {
    "src": "/legacy/members/photos/shipleyaeros/edalelookeast.jpg",
    "name": "Edalelookeast",
    "bytes": 55384
   },
   {
    "src": "/legacy/members/photos/shipleyaeros/monsalhead.jpg",
    "name": "Monsalhead",
    "bytes": 71817
   },
   {
    "src": "/legacy/members/photos/shipleyaeros/sluurypit.jpg",
    "name": "Sluurypit",
    "bytes": 54971
   }
  ]
 },
 {
  "slug": "snow2009-2",
  "title": "Snow2009-2",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow2009-2/fromhangr.jpg",
    "name": "Fromhangr",
    "bytes": 36617
   },
   {
    "src": "/legacy/members/photos/snow2009-2/nrthend.jpg",
    "name": "Nrthend",
    "bytes": 35328
   },
   {
    "src": "/legacy/members/photos/snow2009-2/tohangr.jpg",
    "name": "Tohangr",
    "bytes": 60994
   },
   {
    "src": "/legacy/members/photos/snow2009-2/w.edge.jpg",
    "name": "W.edge",
    "bytes": 55249
   }
  ]
 },
 {
  "slug": "snow-dec09",
  "title": "Snow Dec09",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/snow_dec09/SA700814.jpg",
    "name": "SA700814",
    "bytes": 51704
   },
   {
    "src": "/legacy/members/photos/snow_dec09/SA700815.jpg",
    "name": "SA700815",
    "bytes": 34180
   },
   {
    "src": "/legacy/members/photos/snow_dec09/SA700820.jpg",
    "name": "SA700820",
    "bytes": 19151
   },
   {
    "src": "/legacy/members/photos/snow_dec09/SA700842.jpg",
    "name": "SA700842",
    "bytes": 74183
   }
  ]
 },
 {
  "slug": "120102",
  "title": "120102",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/120102/IMG_0069.jpg",
    "name": "IMG 0069",
    "bytes": 207394
   },
   {
    "src": "/legacy/members/photos/120102/IMG_0082.jpg",
    "name": "IMG 0082",
    "bytes": 161490
   },
   {
    "src": "/legacy/members/photos/120102/IMG_0088.jpg",
    "name": "IMG 0088",
    "bytes": 179202
   }
  ]
 },
 {
  "slug": "camphill-2018",
  "title": "Camphill — 2018",
  "span": "2018",
  "photos": [
   {
    "src": "/legacy/members/photos/180825%20ShowerToSouth.jpg",
    "name": "Shower To South",
    "bytes": 101289
   },
   {
    "src": "/legacy/members/photos/20180201AM.jpg",
    "name": "AM",
    "bytes": 14939
   },
   {
    "src": "/legacy/members/photos/20180202AM.jpg",
    "name": "AM",
    "bytes": 19252
   }
  ]
 },
 {
  "slug": "asperitasclouds170313",
  "title": "Asperitasclouds170313",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/AsperitasClouds170313/AsperitasMore500x251.jpg",
    "name": "Asperitas More500x251",
    "bytes": 56819
   },
   {
    "src": "/legacy/members/photos/AsperitasClouds170313/AsperitasPeak500x334.jpg",
    "name": "Asperitas Peak500x334",
    "bytes": 75904
   },
   {
    "src": "/legacy/members/photos/AsperitasClouds170313/AsperitasStart500x263.jpg",
    "name": "Asperitas Start500x263",
    "bytes": 60949
   }
  ]
 },
 {
  "slug": "derig180120",
  "title": "Derig180120",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/Derig180120/IMG_6793Ra.jpg",
    "name": "IMG 6793Ra",
    "bytes": 25267
   },
   {
    "src": "/legacy/members/photos/Derig180120/IMG_6798aR.jpg",
    "name": "IMG 6798a R",
    "bytes": 32034
   },
   {
    "src": "/legacy/members/photos/Derig180120/IMG_6801bR.jpg",
    "name": "IMG 6801b R",
    "bytes": 39098
   }
  ]
 },
 {
  "slug": "fog161126",
  "title": "Fog161126",
  "span": "2016",
  "photos": [
   {
    "src": "/legacy/members/photos/Fog161126/20161126_141055.jpg",
    "name": "Photograph",
    "bytes": 34973
   },
   {
    "src": "/legacy/members/photos/Fog161126/20161126_141225.jpg",
    "name": "Photograph",
    "bytes": 46996
   },
   {
    "src": "/legacy/members/photos/Fog161126/20161126_141327.jpg",
    "name": "Photograph",
    "bytes": 63050
   }
  ]
 },
 {
  "slug": "krbpaint",
  "title": "Krbpaint",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/KRBPaint/_4097079.jpg",
    "name": "4097079",
    "bytes": 49753
   },
   {
    "src": "/legacy/members/photos/KRBPaint/_4097081.jpg",
    "name": "4097081",
    "bytes": 46627
   },
   {
    "src": "/legacy/members/photos/KRBPaint/_4097087.jpg",
    "name": "4097087",
    "bytes": 61667
   }
  ]
 },
 {
  "slug": "lancs",
  "title": "Lancs",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/Lancs/DSC_3769.jpg",
    "name": "DSC 3769",
    "bytes": 82545
   },
   {
    "src": "/legacy/members/photos/Lancs/DSC_3777.jpg",
    "name": "DSC 3777",
    "bytes": 80924
   },
   {
    "src": "/legacy/members/photos/Lancs/DSC_3781.jpg",
    "name": "DSC 3781",
    "bytes": 83794
   }
  ]
 },
 {
  "slug": "newoffice",
  "title": "Newoffice",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/NewOffice/Office1.jpg",
    "name": "Office1",
    "bytes": 56209
   },
   {
    "src": "/legacy/members/photos/NewOffice/Office2.jpg",
    "name": "Office2",
    "bytes": 71571
   },
   {
    "src": "/legacy/members/photos/NewOffice/Office3.jpg",
    "name": "Office3",
    "bytes": 46115
   }
  ]
 },
 {
  "slug": "spcleffcts",
  "title": "Spcleffcts",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/photos/SpclEffcts/IMG_0884W.jpg",
    "name": "IMG 0884W",
    "bytes": 20819
   },
   {
    "src": "/legacy/members/photos/SpclEffcts/IMG_0885W.jpg",
    "name": "IMG 0885W",
    "bytes": 24035
   },
   {
    "src": "/legacy/members/photos/SpclEffcts/IMG_0887W.jpg",
    "name": "IMG 0887W",
    "bytes": 31157
   }
  ]
 },
 {
  "slug": "sosspics",
  "title": "Sosspics",
  "span": "",
  "photos": [
   {
    "src": "/legacy/members/sossfiles/sosspics/Close%20to%20Pockligton%20-%20Silver%20distance%21v.jpg",
    "name": "Close to Pockligton - Silver distance!v",
    "bytes": 70667
   },
   {
    "src": "/legacy/members/sossfiles/sosspics/CmphllFrmSlvrHt.jpg",
    "name": "Cmphll Frm Slvr Ht",
    "bytes": 55639
   },
   {
    "src": "/legacy/members/sossfiles/sosspics/IMcR-trailerwork.jpg",
    "name": "IMc R-trailerwork",
    "bytes": 31355
   }
  ]
 }
];

export const totalPhotos = albums.reduce((n, a) => n + a.photos.length, 0);
