import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {baseKeymap} from "prosemirror-commands"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"

import {tableEditing} from "prosemirror-tables";

import {buildMenuBar} from "./menu/menubar"
import {buildKeymap} from "./keymap"
import {buildInputRules, buildPlugins, buildPluginKeymap} from "./plugins"

import {goToNextCell} from "prosemirror-tables"


// !! This module exports helper functions for deriving a set of basic
// menu items, input rules, or key bindings from a schema. These
// values need to know about the schema for two reasons—they need
// access to specific instances of node and mark types, and they need
// to know which of the node and mark types that they know about are
// actually present in the schema.
//
// The `exampleSetup` plugin ties these together into a plugin that
// will automatically enable this basic functionality in an editor.

// :: (Object) → [Plugin]
// A convenience plugin that bundles together a simple menu with basic
// key bindings, input rules, and styling for the example schema.
// Probably only useful for quickly setting up a passable
// editor—you'll need more control over your settings in most
// real-world situations.
//
//   options::- The following options are recognized:
//
//     schema:: Schema
//     The schema to generate key bindings and menu items for.
//
//     mapKeys:: ?Object
//     Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
//
//     menuBar:: ?bool
//     Set to false to disable the menu bar.
//
//     history:: ?bool
//     Set to false to disable the history plugin.
//
//     floatingMenu:: ?bool
//     Set to false to make the menu bar non-floating.
//
//     menuContent:: [[MenuItem]]
//     Can be used to override the menu content.
export function setupPlugins(context) {
    let result = buildPluginKeymap(context);

    result = result.concat([
        buildInputRules(context),
        keymap(buildKeymap(context)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        tableEditing(),
        buildMenuBar(context),
        keymap({
            "Tab": goToNextCell(1),
            "Shift-Tab": goToNextCell(-1)
        })
    ]);

    if (context.options.history !== false) {
        result.push(history())
    }

    return result.concat(buildPlugins(context));
}
