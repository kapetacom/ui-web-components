import Peggy from 'peggy';

// @ts-ignore
import GRAMMAR from './grammars/grammar_tokens.pegjs';

export const TokenParser = Peggy.generate(GRAMMAR);