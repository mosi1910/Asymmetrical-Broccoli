/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {headingRule} from './input-rules'
import {menu} from "./menu"
import markdown_it_anchor_plugin from "markdown-it-anchor"


const heading = {
    id: 'heading',
    schema: schema,
    menu: (context) => menu(context),
    inputRules: (schema) => {return [headingRule(schema)]},
};

export default heading;
