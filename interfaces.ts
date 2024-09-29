// Generic
export interface GenericTag {
	tag: string;
	tag_content: string;
}

export interface GenericCommentBlock {
	blocNumber :number;
	genericTagSentence: GenericTag[];
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

export interface StepDefTag {
	description: string;
}

export interface TodoTag {
	todo_type: string;
	todo_text: string;
}

export interface FolderTag {
	folder_name:string;
}

export interface CommentBlock {
	blocNumber : number;
	folder : string;
	stepDef?: string;
	paramTags?: ParamTag[];
	descriptionTags?: DescriptionTag[];
	todoTags?: TodoTag[];
	genericTags?: GenericTag[];
}
export interface FileComment {
	fileName: string;
	commentBlocks: CommentBlock[];
	folderNames : string[];
}
