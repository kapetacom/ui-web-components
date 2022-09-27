import Peggy from 'peggy';

// @ts-ignore
import GRAMMAR from './grammar_tokens.pegjs';

export const TokenParser = Peggy.generate(GRAMMAR);