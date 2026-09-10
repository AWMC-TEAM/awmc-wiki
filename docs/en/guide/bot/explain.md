# Terminology

::: tip
Use Ctrl+F to search for specific terms.
:::

## B50

Full name: Best 50.

maimai DX uses a special formula to calculate the Rating earned from each song.

Sorted from highest to lowest, the top 35 <abbr title="Songs not updated in the current version">old version songs</abbr> and top 15 <abbr title="The current CN server version is maimai DX 2025">new version songs</abbr> make up the B50.

Adding their Ratings together gives you the <abbr title="Translated as 'DX Rating' in CN server after maimai DX 2025">DX Rating</abbr>.

### B50 Filter Syntax

When querying B50, the following filters are independent of each other:

- `紫b50` / `白b50`: filter by chart difficulty, corresponding to Master / Re:MASTER.
- `三星b50` / `四星b50`: filter by the DX star count of the result, 3 stars / 4 stars.
- `3b50` / `4b50` / `13+b50`: filter by numeric level or constant; these numbers are not DX stars.
- `紫13+b50` / `14.0b50`: combine chart difficulty with level/constant, meaning purple chart 13+ and constant 14.0 respectively.
- `<condition>ab50`: e.g. `13+ab50`, filter by the same condition but without splitting B35/B15; directly take the 50 highest-Rating songs from the filtered results.

Therefore, "single-song-level B50" usually means viewing your best results at a
specific level, e.g. sending `13+b50`. The Bot filters that level from your
full score history, recalculates each song's Rating, then forms the conditional
B35/B15 by old/new version; it is not querying one song, nor is it listing the
entire song library at that level.

### B40

Full name: Best 40.

The <abbr title="Translated as 'DX Rating' in CN server after maimai DX 2025">DX Rating</abbr> calculation method used in maimai DX 2022 and earlier versions. No longer in use, but some BOTs can still generate it.

## FC / Full Combo

Full name: <abbr title="Translated as 'Full Combo' in CN server after maimai DX 2025">Full Combo</abbr>. A special evaluation in maimai that requires all Notes during gameplay to receive a Good or better judgment.

### FC+

Full name: <abbr title="Translated as 'Full Combo+' in CN server after maimai DX 2025">Full Combo+</abbr>. A special evaluation in maimai. Unlike FC, it requires all Notes during gameplay to receive a Great or better judgment.

## AP / PM / AJ

::: tip Note
This type of evaluation is common across rhythm games.
:::

Full name: <abbr title="Translated as 'All Perfect' in CN server after maimai DX 2025">All Perfect</abbr>. A special evaluation in maimai that requires all Notes during gameplay to receive a Perfect or better judgment.

PM comes from the mobile rhythm game Arcaea (full name: Pure Memory), with conditions similar to AP. AJ comes from the arcade rhythm game CHUNITHM (full name: All Justice), also with conditions similar to AP.

### AP+ / Theoretical Max

Full name: <abbr title="Translated as 'All Perfect+' in CN server after maimai DX 2025">All Perfect+</abbr>. A special evaluation in maimai that requires all Notes during gameplay to receive a Perfect or better judgment, AND all BREAK notes must receive Critical Perfect judgment. Achieving this results in the <abbr title="101.0000%">theoretical maximum score</abbr>, hence it is also called "theoretical max."
