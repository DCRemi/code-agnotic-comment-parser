// Generic
export interface TagIndex {
	tag: string;
	tagStart: number;
	tagEnd: number;
}

export interface GenericTagSentence {
	tag: string;
	tag_content: string;
}

export interface GenericCommentBlock {
	blocNumber: number;
	genericTagSentences: GenericTagSentence[];
}

export interface GenericGlobalComments {
	genericCommentBlocks: GenericCommentBlock[];
}

// Specific
export interface ParamTag {
	param_type: string;
	param_name: string;
	param_desc: string;
}

export interface DescriptionTag {
	description: string;
}

export interface GenericTag {
	tag: string;
	content: string;
}

export interface SeeTag {
	see_content: string;
}

export interface ExampleTag {
	example_content: string;
}

export interface StepDefTag {
	description: string;
}

export interface TodoTag {
	todo_type: string;
	todo_text: string;
}

export interface interactionTypeTag {
	interactionType_name: string;
}

export interface CommentBlock {
	blocNumber: number;
	interactionType?: string;
	stepDef?: string;
	paramTags?: ParamTag[];
	descriptionTags?: DescriptionTag[];
	seeTags?: SeeTag[];
	exampleTags?: ExampleTag[];
	todoTags?: TodoTag[];
	genericTags?: GenericTag[];
}

export interface FileCommentExtract {
	fileName: string;
	commentBlocks: CommentBlock[];
	interactionTypes?: string[];
}
