import { Abilities } from '../data/abilities';
import { Rulesets } from '../data/rulesets';
import { FormatsData } from '../data/formats-data';
import { Items } from '../data/items';
import { Moves } from '../data/moves';
import { Natures } from '../data/natures';
import { Pokedex } from '../data/pokedex';
import { Scripts } from '../data/scripts';
import { Conditions } from '../data/conditions';
import { TypeChart } from '../data/typechart';
import * as AliasesMod from '../data/aliases';
import * as TxtPokedex from '../data/text/pokedex';
import * as TxtTags from '../data/text/tags';
import * as TxtNames from '../data/text/names';
import * as TxtMoves from '../data/text/moves';
import * as TxtAbilities from '../data/text/abilities';
import * as TxtItems from '../data/text/items';
import * as TxtDefault from '../data/text/default';

export const BASE_DATA: { [k: string]: any } = {
	Abilities, Rulesets, FormatsData, Items, Moves, Natures, Pokedex, Scripts, Conditions, TypeChart,
	Learnsets: {}, PokemonGoData: {},
};
export const ALIASES: any = AliasesMod;
export const TEXT: { [k: string]: any } = {
	pokedex: TxtPokedex, tags: TxtTags, names: TxtNames, moves: TxtMoves,
	abilities: TxtAbilities, items: TxtItems, default: TxtDefault,
};
export const FORMATS: any[] = [
	{ name: '[Gen 9] Infinite', mod: 'gen9', gameType: 'singles', ruleset: ['+Past', '+Unobtainable', '+Nonexistent'] },
	{ name: '[Gen 9] Infinite Doubles', mod: 'gen9', gameType: 'doubles', ruleset: ['+Past', '+Unobtainable', '+Nonexistent'] },
];
