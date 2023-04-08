import { type BookType, utils, write, writeFile } from "xlsx";

/**
 * Exports the generated truth table to an excel (.xlsx) file
 *
 * @param type The downloaded files extension. Default is "xlsx"
 * @param name The name of the file, excluding the extension. Default is "Truth Table"
 * @param dl
 * @param tableId The id of the table to export
 * @returns {any}
 * @author SheetJS
 * @link https://cdn.sheetjs.com/
 * @license Apache 2.0 License
 * SheetJS Community Edition -- https://sheetjs.com/
 *
 * Copyright (C) 2012-present   SheetJS LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export function exportToExcel(
    {
        type = "xlsx",
        name = "Truth Table",
        dl = false,
        tableId,
    }: { type?: BookType, name?: string, dl?: boolean, tableId: string }): any {

    const element = document.getElementById(tableId);
    const wb = utils.table_to_book(element, { sheet: "sheet1" });
    return dl ?
        write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        writeFile(wb, name + "." + type);
}
