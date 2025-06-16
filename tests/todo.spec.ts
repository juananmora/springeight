import { test, expect } from '@playwright/test';
import { TodoPage } from './todo-page';

test.describe('Todo MVC Test Suite', () => {
    let todoPage: TodoPage;

    test.beforeEach(async ({ page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
    });

    test.describe('SUITE 1: Creation of New Tasks', () => {
        test('TC-001: Add individual TODO items', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await expect(todoPage.todoItems).toHaveCount(1);
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some cheese');

            await todoPage.addTodo('feed the cat');
            await expect(todoPage.todoItems).toHaveCount(2);
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some cheese');
            await expect(todoPage.todoItems.nth(1)).toHaveText('feed the cat');
        });

        test('TC-002: Clear input field after adding', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await expect(todoPage.newTodoInput).toHaveValue('');
            await expect(todoPage.todoItems).toHaveCount(1);
        });

        test('TC-003: Items order in list', async ({ page }) => {
            const todos = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];
            for (const todo of todos) {
                await todoPage.addTodo(todo);
            }
            await expect(todoPage.todoItems).toHaveCount(3);
            await expect(todoPage.itemsLeftCounter).toHaveText('3 items left');
            
            for (let i = 0; i < todos.length; i++) {
                await expect(todoPage.todoItems.nth(i)).toHaveText(todos[i]);
            }
        });
    });

    test.describe('SUITE 2: Mark All Tasks as Completed', () => {
        test('TC-004: Mark all tasks as completed', async ({ page }) => {
            const todos = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];
            for (const todo of todos) {
                await todoPage.addTodo(todo);
            }
            await todoPage.toggleAll();
            
            for (const item of await todoPage.todoItems.all()) {
                await expect(item).toHaveClass(/completed/);
            }
        });

        test('TC-005: Unmark all completed tasks', async ({ page }) => {
            const todos = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];
            for (const todo of todos) {
                await todoPage.addTodo(todo);
            }
            await todoPage.toggleAll(); // Mark all
            await todoPage.toggleAll(); // Unmark all
            
            for (const item of await todoPage.todoItems.all()) {
                await expect(item).not.toHaveClass(/completed/);
            }
            await expect(todoPage.toggleAllCheckbox).not.toBeChecked();
        });
    });

    test.describe('SUITE 3: Individual Task Management', () => {
        test('TC-007: Mark individual tasks as completed', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            
            await todoPage.toggleTodo(0);
            await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
            await expect(todoPage.todoItems.nth(1)).not.toHaveClass(/completed/);
            
            await todoPage.toggleTodo(1);
            await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
            await expect(todoPage.todoItems.nth(1)).toHaveClass(/completed/);
        });

        test('TC-008: Unmark completed tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.toggleTodo(0);
            await todoPage.toggleTodo(0); // unmark
            
            await expect(todoPage.todoItems.nth(0)).not.toHaveClass(/completed/);
            await expect(todoPage.todoItems.nth(1)).not.toHaveClass(/completed/);
        });

        test('TC-009: Edit existing task', async ({ page }) => {
            const todos = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];
            for (const todo of todos) {
                await todoPage.addTodo(todo);
            }
            
            await todoPage.editTodo(1, 'buy some sausages');
            
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some cheese');
            await expect(todoPage.todoItems.nth(1)).toHaveText('buy some sausages');
            await expect(todoPage.todoItems.nth(2)).toHaveText('book a doctors appointment');
        });
    });

    test.describe('SUITE 4: Editing Functionality', () => {
        test('TC-010: Hide controls during editing', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.todoItems.nth(0).dblclick();
            
            await expect(todoPage.todoItems.nth(0).locator('.toggle')).toBeHidden();
            await expect(todoPage.todoItems.nth(0).locator('label')).toBeHidden();
        });

        test('TC-011: Save edit on blur', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.todoItems.nth(0).dblclick();
            await page.locator('.editing .edit').fill('buy some sausages');
            await page.click('body'); // click outside to blur
            
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some sausages');
        });

        test('TC-012: Trim whitespace when editing', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.editTodo(0, '    buy some sausages    ');
            
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some sausages');
        });
    });

    test.describe('SUITE 5: Task Counter', () => {
        test('TC-015: Show current number of tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await expect(todoPage.itemsLeftCounter).toHaveText('1 item left');
            
            await todoPage.addTodo('feed the cat');
            await expect(todoPage.itemsLeftCounter).toHaveText('2 items left');
        });
    });

    test.describe('SUITE 6: Clear Completed Button', () => {
        test('TC-016: Show button when there are completed tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.addTodo('book a doctors appointment');
            
            await expect(todoPage.clearCompletedButton).toBeHidden();
            await todoPage.toggleTodo(0);
            await expect(todoPage.clearCompletedButton).toBeVisible();
        });

        test('TC-017: Remove completed tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.addTodo('book a doctors appointment');
            
            await todoPage.toggleTodo(1);
            await todoPage.clearCompleted();
            
            await expect(todoPage.todoItems).toHaveCount(2);
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some cheese');
            await expect(todoPage.todoItems.nth(1)).toHaveText('book a doctors appointment');
        });
    });

    test.describe('SUITE 7: Data Persistence', () => {
        test('TC-019: Maintain data after reload', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.toggleTodo(0);
            
            await page.reload();
            
            await expect(todoPage.todoItems).toHaveCount(2);
            await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
            await expect(todoPage.todoItems.nth(0).locator('.toggle')).toBeChecked();
        });
    });

    test.describe('SUITE 8: Filters and Navigation', () => {
        test('TC-020: Filter active tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.addTodo('book a doctors appointment');
            await todoPage.toggleTodo(1);
            
            await todoPage.filterActive.click();
            await expect(todoPage.todoItems).toHaveCount(2);
            await expect(todoPage.todoItems.nth(0)).toHaveText('buy some cheese');
            await expect(todoPage.todoItems.nth(1)).toHaveText('book a doctors appointment');
        });

        test('TC-022: Filter completed tasks', async ({ page }) => {
            await todoPage.addTodo('buy some cheese');
            await todoPage.addTodo('feed the cat');
            await todoPage.addTodo('book a doctors appointment');
            await todoPage.toggleTodo(1);
            
            await todoPage.filterCompleted.click();
            await expect(todoPage.todoItems).toHaveCount(1);
            await expect(todoPage.todoItems.nth(0)).toHaveText('feed the cat');
        });

        test('TC-024: Highlight active filter', async ({ page }) => {
            await expect(todoPage.filterAll).toHaveClass(/selected/);
            
            await todoPage.filterActive.click();
            await expect(todoPage.filterActive).toHaveClass(/selected/);
            
            await todoPage.filterCompleted.click();
            await expect(todoPage.filterCompleted).toHaveClass(/selected/);
        });
    });
});