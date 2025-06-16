import { Page, Locator } from '@playwright/test';

export class TodoPage {
    readonly page: Page;
    readonly newTodoInput: Locator;
    readonly todoItems: Locator;
    readonly toggleAllCheckbox: Locator;
    readonly itemsLeftCounter: Locator;
    readonly clearCompletedButton: Locator;
    readonly filterAll: Locator;
    readonly filterActive: Locator;
    readonly filterCompleted: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodoInput = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.locator('.todo-list li');
        this.toggleAllCheckbox = page.locator('.toggle-all');
        this.itemsLeftCounter = page.locator('.todo-count');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
        this.filterAll = page.getByRole('link', { name: 'All' });
        this.filterActive = page.getByRole('link', { name: 'Active' });
        this.filterCompleted = page.getByRole('link', { name: 'Completed' });
    }

    async goto() {
        await this.page.goto('https://demo.playwright.dev/todomvc');
    }

    async addTodo(text: string) {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }

    async toggleTodo(index: number) {
        await this.todoItems.nth(index).locator('.toggle').click();
    }

    async toggleAll() {
        await this.toggleAllCheckbox.click();
    }

    async editTodo(index: number, newText: string) {
        await this.todoItems.nth(index).dblclick();
        await this.page.locator('.editing .edit').fill(newText);
        await this.page.locator('.editing .edit').press('Enter');
    }

    async deleteTodo(index: number) {
        await this.todoItems.nth(index).hover();
        await this.todoItems.nth(index).locator('.destroy').click();
    }

    async clearCompleted() {
        await this.clearCompletedButton.click();
    }
}