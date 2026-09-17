# DLS Icons Reference

## Quick Reference

DLS provides a set of icons that can be used across components. Icons are available as React components and can be customized with props for size, color, and fill.

## Mandatory Rules

1. **Only use icons that exist in the "Available Icons" list below.** Never invent, assume, or guess icon names based on what the icon represents. Icon names in DLS may not match common semantic descriptions.
2. **Icon names must match exactly** - DLS icons use specific naming conventions (e.g., `IconAlert` for notification bell, not `IconBell`).
3. Never use custom SVGs, emojis, or icon libraries outside of the DLS icons.
4. If an icon you need doesn't exist in the list, use the next closest icon from the available icons.

### Common Hallucinated Icon Names (DO NOT USE):

These icon names **DO NOT EXIST** in DLS. Use the correct alternatives instead:

- ❌ `IconBell` → ✅ Use `IconAlert` (notification bell)
- ❌ `IconClock` → ✅ Use `IconTime` (clock icon)
- ❌ `IconNotification` → ✅ Use `IconAlert` (notification bell)
- ❌ `IconMagnifyingGlass` → ✅ Use `IconSearch` (magnifying glass)
- ❌ `IconUser` → ✅ Use `IconAccount` (user profile)
- ❌ `IconProfile` → ✅ Use `IconAccount` (user profile)
- ❌ `IconSettings` → ✅ Use `IconSetting` (gear icon, note: singular "Setting")
- ❌ `IconGear` → ✅ Use `IconSetting` (gear/cog icon)

## Import

Import specific icon components by name, like this:

```tsx
import { IconHome } from '@americanexpress/dls-icons';
```

## Minimal Example

Only specify props when you need to override the defaults:

```tsx
import { IconHome, IconAccount, IconStar } from '@americanexpress/dls-icons';
<IconHome size="md" />
<IconAccount isFilled={true} />
<IconStar color="inherit" />
```

## Icon Props API
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| size | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | No | `'sm'` | Icon size |
| color | `'brand'` \| `'brand-alt'` \| `'caution'` \| `'success'` \| `'critical'` \| `'information'` \| `'black'` \| `'white'`\| `'neutral'`\| `'inherit'`| No | `'brand'` | Icon color |
| isFilled | boolean | No | false | Whether to use filled or outlined version |
| title | string | No | - | Accessible title for screen readers |
| titleId | string | No | - | Unique ID for title element (used for accessibility) |

## Available Icons

Grouped by category with a list of icon names with a short description.

### Actions
- `IconEdit`: Pencil icon for editing
- `IconDownload`: Downward arrow with line
- `IconUpload`: Upward arrow with line
- `IconChange`: Two circular swap arrows
- `IconThumbsUp`: Thumbs up hand
- `IconThumbsDown`: Thumbs down hand
- `IconLock`: Closed padlock
- `IconUnlock`: Open padlock
- `IconSearch`: Magnifying glass
- `IconShow`: Open eye
- `IconHide`: Eye with diagonal slash
- `IconGlobal`: World globe
- `IconGuide`: Open book
- `IconStar`: Star outline
- `IconHeart`: Heart outline
- `IconExpand`: Two outward diagonal arrows
- `IconCollapse`: Two inward diagonal arrows
- `IconGeolocation`: Crosshair circle
- `IconLocationServices`: Compass needle arrow
- `IconDirection`: Right arrow with turn
- `IconShare`: Connected dots network
- `IconTapToPay`: Card with contactless waves
- `IconReceiptAdd`: Receipt with plus sign
- `IconReceiptView`: Receipt with checkmark
- `IconTrash`: Trash bin
- `IconPlayCircle`: Play button in circle
- `IconPauseCircle`: Pause button in circle
- `IconClosedCaptions`: Speech bubble
- `IconClosedCaptionsOff`: Speech bubble with slash
- `IconPlay`: Triangular play button
- `IconPause`: Parallel bars
- `IconSound`: Speaker with sound waves
- `IconSoundOff`: Speaker with mute slash
- `IconCamera`: Camera device
- `IconFlash`: Lightning bolt
- `IconFlashOff`: Lightning bolt with slash
- `IconQrScan`: QR code in frame
- `IconFilter`: Lines with adjustment dots
- `IconMoreCircle`: Three dots in circle
- `IconMoreHorizontal`: Three horizontal dots
- `IconMoreVertical`: Three vertical dots
- `IconMenu`: Hamburger menu lines
- `IconLaunch`: External link arrow
- `IconCopy`: Overlapping squares
- `IconWifi`: Wireless signal waves
- `IconWifiOff`: Wireless signal with slash
- `IconAttach`: Paperclip
- `IconGrid`: Four-square grid
- `IconList`: Stacked horizontal lines
- `IconArchive`: Box with lid
- `IconBookmark`: Bookmark ribbon

### Banking
- `IconBankApp`: Bank icon in square frame
- `IconBankMobile`: Bank in portrait mobile device
- `IconBankMobileLandscape`: Bank in landscape mobile device
- `IconBillPay`: Document with dollar sign
- `IconCd`: Padlock with dollar sign
- `IconCheckBanking`: Check icon
- `IconCheckScan`: Check with scan frame
- `IconDirectDeposit`: Circular arrows with lock
- `IconECheck`: Digital check with lines
- `IconHighYield`: Upward trending bar chart
- `IconInstant`: Clock with speed lines
- `IconMultiChannel`: Multiple device screens
- `IconOverdraftProtection`: Shield with dollar sign
- `IconRecurringInterest`: Percentage with circular arrows
- `IconRetirement`: Growing plant
- `IconQuickTransfer`: Bidirectional horizontal arrows
- `IconRoundTheClock`: Number 24 with circular arrow
- `IconSavings`: Piggy bank
- `IconSecurity`: Shield with lock
- `IconTransfer`: Bidirectional arrows
- `IconWireTransfer`: Bank building with arrow
- `IconJointCheckingAccount`: Building with columns

### Business
- `IconCard`: Single payment card
- `IconCards`: Stacked payment cards
- `IconCardContactless`: Card with contactless wave symbol
- `IconCardsContactless`: Stacked cards with contactless symbol
- `IconCardInsert`: Card with insert hand gesture
- `IconCardSwipe`: Card with swipe hand gesture
- `IconCardTap`: Card with tap hand gesture
- `IconBilling`: Document with horizontal lines
- `IconPaymentDue`: Clock with circular arrow
- `IconStatementPaid`: Checkmark in circle
- `IconStatementReady`: Document with checkmark
- `IconReceipt`: Paper receipt with serrated edge
- `IconTag`: Price tag shape
- `IconBank`: Building with columns
- `IconOpenBanking`: Building with balance scale
- `IconBusiness`: Briefcase
- `IconBarChart`: Vertical bars chart
- `IconCarbon`: Leaf with chart symbol
- `IconLineGraph`: Upward trending line
- `IconPieChart`: Segmented pie chart
- `IconP2p`: Person with bidirectional arrow
- `IconPaperless`: Single leaf
- `IconCalculator`: Calculator device
- `IconCreditScore`: Speedometer gauge
- `IconWallet`: Wallet
- `IconTransferToCard`: Card with refresh arrow
- `IconSelectDefaultCard`: Card with checkmark
- `IconReplaceCard`: Card with swap arrows
- `IconRemoveCard`: Card with minus sign
- `IconRefer`: Person with directional arrow
- `IconAddCard`: Card with plus sign
- `IconAddSomeone`: Person with plus sign
- `IconCheckSpendingPower`: Card with lightning bolt
- `IconLockCard`: Card with lock symbol
- `IconPayOverTime`: Card with clock

### Communication
- `IconDesktop`: Monitor on stand
- `IconLaptop`: Open laptop
- `IconTablet`: Rectangular tablet
- `IconMobile`: Smartphone portrait
- `IconTelephone`: Phone handset
- `IconEmail`: Envelope
- `IconFeedback`: Speech bubble with text
- `IconFingerprint`: Fingerprint pattern
- `IconChat`: Speech bubble
- `IconFaceid`: Face with lock indicator
- `IconSmartwatch`: Wristwatch with checkmark
- `IconSocial`: @ symbol
- `IconLink`: Chain link
- `IconLinkOut`: Square with outward arrow

### Currency
- `IconDollar`: Dollar sign in circle
- `IconDollarCashback`: Dollar with single curved arrow
- `IconDollarAutopay`: Dollar with two circular arrows
- `IconBaht`: Thai baht symbol in circle
- `IconBahtCashback`: Thai baht with single curved arrow
- `IconBahtAutopay`: Thai baht with two circular arrows
- `IconEuro`: Euro symbol in circle
- `IconEuroCashback`: Euro with single curved arrow
- `IconEuroAutopay`: Euro with two circular arrows
- `IconKrone`: Krone symbol in circle
- `IconKroneCashback`: Krone with single curved arrow
- `IconKroneAutopay`: Krone with two circular arrows
- `IconPound`: British pound symbol in circle
- `IconPoundCashback`: Pound with single curved arrow
- `IconPoundAutopay`: Pound with two circular arrows
- `IconRupee`: Indian rupee symbol in circle
- `IconRupeeCashback`: Rupee with single curved arrow
- `IconRupeeAutopay`: Rupee with two circular arrows
- `IconYen`: Japanese yen symbol in circle
- `IconYenCashback`: Yen with single curved arrow
- `IconYenAutopay`: Yen with two circular arrows
- `IconNoFee`: Dollar sign with slash
- `IconPoundNoFee`: Pound symbol with slash

### Directional
- `IconPlus`: Plus sign
- `IconMinus`: Minus sign
- `IconEqual`: Equal sign
- `IconArrowLeft`: Left triangle arrow
- `IconArrowUp`: Up triangle arrow
- `IconArrowDown`: Down triangle arrow
- `IconArrowRight`: Right triangle arrow
- `IconChevronLeft`: Left angle bracket
- `IconChevronUp`: Up angle bracket
- `IconChevronRight`: Right angle bracket
- `IconChevronDown`: Down angle bracket
- `IconChevronDoubleLeft`: Double left angle brackets
- `IconChevronDoubleRight`: Double right angle brackets
- `IconClose`: X symbol
- `IconPlusCircle`: Plus sign in circle
- `IconMinusCircle`: Minus sign in circle
- `IconCancelCircle`: X in circle
- `IconSource`: Code brackets

### Membership
- `IconAirplane`: Commercial aircraft
- `IconCar`: Automobile
- `IconCardBenefit`: Card with star
- `IconConcierge`: Service bell
- `IconConstruction`: Hammer
- `IconCruiseShip`: Cruise ship
- `IconDataProtection`: Table with lock
- `IconDental`: Tooth
- `IconDining`: Fork and knife
- `IconDonate`: Palm with heart
- `IconEntertainment`: Event ticket
- `IconFraudProtection`: Fingerprint with lock
- `IconFreezeCard`: Snowflake on shield
- `IconGasStation`: Fuel pump
- `IconGift`: Wrapped gift box
- `IconGiftCard`: Card with bow
- `IconHotel`: Bed
- `IconInfinity`: Infinity symbol
- `IconInsurance`: Shield
- `IconLocation`: Map pin
- `IconLounge`: Armchair
- `IconMedal`: Medal with ribbon
- `IconMedical`: Medical bag with cross
- `IconMembership`: Hexagon with person
- `IconMerchandise`: Shopping bag
- `IconOffersDesktop`: Stacked rectangles with star
- `IconOffersMobile`: Mobile device with star
- `IconOversizeBag`: Large luggage with arrow
- `IconPartnership`: Handshake
- `IconPet`: Paw print
- `IconPoint2x`: Circle with 2X text
- `IconPoint3x`: Circle with 3X text
- `IconPoint5x`: Circle with 5X text
- `IconPoint8x`: Circle with 8X text
- `IconPoint10k`: Circle with 10K text
- `IconPoint20k`: Circle with 20K text
- `IconRecentPoints`: Star in circle with arrow
- `IconRefreshment`: Beverage cup with straw
- `IconRewards`: Hexagon with star
- `IconShippingTruck`: Delivery truck with checkmark
- `IconCart`: Shopping cart
- `IconSpa`: Lotus flower
- `IconSendAndSplit`: Arrow with split symbol
- `IconSplit`: Y-shaped fork
- `IconTaxi`: Taxi cab
- `IconTrain`: Train locomotive
- `IconTravelBag`: Suitcase
- `IconSend`: Right directional arrow

### Status
- `IconSuccess`: Checkmark in circle
- `IconNeutral`: Exclamation mark in circle
- `IconWarning`: Triangle with exclamation mark
- `IconInfo`: Letter i in circle
- `IconDeclined`: Circle with diagonal slash
- `IconHelp`: Question mark in circle
- `IconRefresh`: Single curved arrow in circle
- `IconProcessing`: Two circular arrows
- `IconCheck`: Checkmark
- `IconAlert`: Notification bell

### Android
- `IconAndroid`: Android mascot/logo
- `IconBackAndroid`: Left arrow
- `IconBiometricsAndroid`: Fingerprint or face in circle
- `IconCloseAndroid`: X symbol
- `IconMyLocationAndroid`: Crosshair target

### IOS
- `IconBackIos`: Left chevron
- `IconBiometricsIos`: Face ID frame/brackets
- `IconCheckmarkIos`: iOS-style checkmark
- `IconChevronIos`: Right chevron
- `IconIos`: Apple logo
- `IconMyLocationIos`: Navigation arrow/compass