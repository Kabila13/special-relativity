# Interactive verification notes

The active development preview loads the Relativity Observatory page with the expected labeled controls: a day/night mode control, frame buttons, three range inputs for relative speed and event coordinates, scenario buttons, derivation reveals, and diagnostic radios.

The relative-speed range input can be focused from the browser. The first keyboard increment attempt did not produce a visible state change in the browser output, so the discrete scenario controls were also tested.

Selecting **Near c** updated the complete model coherently: β changed from 0.60 to 0.88, the selected event changed to (3.0, 3.1), γ changed from 1.250 to 2.105, the dilated interval changed from 12.50 μs to 21.05 μs, the contracted length changed from 96.0 m to 57.0 m, and the transformed event values changed to X′ = 0.57 light-μs and t′ = 0.97 μs. Selecting **Frame S′** updated both the event readout heading and the diagram’s active-view tag.

The TypeScript and production-build checks pass. Full-page desktop and 375 px mobile captures show the observatory console, controls, calculations, and content hierarchy without visible overflow.

The alternate **Day Sheet** mode was activated successfully; its control changed to “Night field”, confirming the state update. A correct quiz response was then selected through its label. The selected card displayed the “Model confirmed” explanation and the module status advanced to **1 of 3 conceptual checks resolved**.

## Chapter 6 revision verification

The source-aligned revision passed TypeScript and production-build checks. Desktop and 375 px full-page reviews show the added velocity-addition panel, muon-decay evidence card, revised source sequence, worked lightning-event example, and existing spacetime instrument without visible overflow.

The initial velocity challenge state matches the Chapter 6 missile case: v = 0.80c and u′ = 0.50c, producing u = 0.929c against a Galilean comparison of 1.30c. The Light beam preset click did not produce a visible updated state in the browser response, so an alternate preset path will be tested before treating the challenge verification as complete.

The signed two-rockets preset updated successfully to v = −0.80c and u′ = +0.90c, producing u = +0.357c. The explanatory copy now correctly identifies that the signed Galilean comparison can underestimate the relativistic result for opposite directions. After correcting the light-speed input range, the Light beam preset updated successfully to v = +0.90c and u′ = +1.00c; the calculator returned u = +1.000c, marked it as exactly c, and contrasted it with the impossible Galilean 1.90c value.

## Reading and sharing enhancement verification

At the top of the lesson, the new Chapter 6 progress meter initialised at 0%. After one viewport of reading scroll, it updated to 15%, confirming that it measures actual page progress rather than navigation-button selection. Desktop and 375 px full-page captures retain the top indicator and the share action without visible layout overflow.

After a further scroll to the velocity-addition panel, the meter reported 51%, and the active reading-rail item changed to the velocity section. The Share this result control was activated without any external post or navigation. Because this browser environment may expose a native share capability without rendering its system dialog in the automation transcript, its availability will be inspected separately; the application retains a clipboard-copy fallback when native sharing is unavailable.

The browser exposes no native share API but does expose clipboard writing. After adding a timeout plus a legacy-copy fallback for delayed clipboard permissions, activating the control visibly changed its label to **Copied result**. This confirms that the share message—including the active inputs, relativistic result, Galilean comparison, and current page URL—reaches the copy fallback in the test environment.

## Animation, persistence, and export verification

The updated desktop and 375 px layouts show the two-lane spacecraft visual directly below the velocity-addition challenge. It labels the observer frame, frame speed, input speed, and calculated relativistic speed; the red S′ craft and cyan probe use input-driven duration and direction, with the existing reduced-motion rule applying globally.

On a fresh live-page visit, the module restored the previously saved learning state at approximately 50% reading progress and reported **Previous learning state restored**, demonstrating browser-local continuity. The downloaded-summary control was then activated with the restored state; the browser moved to the bottom saved-learning panel and reported 100% reading progress, consistent with the native browser download interaction.

The controlled browser’s download history and sandbox download directory remained empty after the export attempt, while the application control remained available. This is treated as an automation-environment limitation rather than proof of a failed client implementation: the exported PDF is generated by `jsPDF` inside the visible click handler and the project passes TypeScript and production-build checks. The user should make one manual export check in their own browser after publishing, where standard browser download permissions apply.

Following a later page reload, the saved record restored again and reported **Previous learning state restored** with 73% reading progress, confirming repeated local restoration behavior.

The explicit reset control was exercised next. It moved the lesson back to the top, set progress to 0%, cleared the diagnostic score, and reported **Learning record reset**. A subsequent fresh visit reported **Auto-save ready** at 0%, confirming that the cleared record did not restore.
