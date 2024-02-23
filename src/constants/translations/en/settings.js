export default {
	categories: {
		title: 'Delete categories',
		buttonText: 'Delete',
		alert: {
			title: 'Please confirm',
			message: 'This category will not appear anymore on your selecting list',
			error: {
				title: 'UNKNOWN ERROR',
				message: 'Categories cannot be deleted {{code}}'
			}
		}
	},
	descriptions: {
		title: 'Delete location',
		buttonText: 'Delete',
		alert: {
			title: 'Please confirm',
			message: 'This description will not appear anymore on your selecting list',
			error: {
				title: 'UNKNOWN ERROR',
				message: 'Description item cannot be deleted {{code}}'
			}
		}
	},
	users: {
		title: 'Your family',
		addButtonText: 'Add',
		editButtonText: 'Save',
		alert: {
			title: 'Confirm deleting',
			message: 'Are you sure you want to delete this user?',
			error: {
				title: 'UNKNOWN ERROR',
				message: 'Elementul selectat nu a putut fi sters {{code}}'
			}
		}
	},
	other: {
		title: "Other",
		location: "Without location when add/edit",
		users: "Without family member when add/edit",
		categories: "Without categories when add/edit",
		season: "Without season when add/edit"
	}
};
